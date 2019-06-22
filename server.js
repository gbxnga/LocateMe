// Necessary Tools
var geo = require("./geo");
var toolbox = require("./toolbox");

// Load api key from .env file
require("dotenv").config();

// Create a google maps client with apikey from environment
var googleMapsClient = require("@google/maps").createClient({
    key: process.env.API_KEY
});

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Required to allow client-side to make request to this server
var cors = require("cors");
app.use(cors());

// Enable reading JSON data from client-side
app.use(bodyParser.json());

// Setting up the path to frontend
app.use(express.static(require("path").join(__dirname, "public")));

// Start the server
app.listen(3000, function() {
    console.log("Listening on Port 3000");
});

// Main Route
app.get("/", function(req, res) {
    res.sendFile("index.html");
});

// Returns the Digital Address of GPS
app.post("/address", function(req, res) {
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    console.log("Checking for [" + lat + "," + lon + "]");

    let ReverseGeoCode = new Promise((resolve, reject) => {
        googleMapsClient.reverseGeocode(
            {
                latlng: [lat, lon]
            },
            function(err, response) {
                if (!err) {
                    geoinfo = response.json.results[0];
                    resolve(geoinfo);
                } else {
                    reject(err);
                }
            }
        );
    });

    ReverseGeoCode.then(function(addressInfo) {
        console.log(addressInfo.address_components[1].long_name);
        addressComponents = addressInfo.address_components;

        GetDigitalAddress(lat, lon, addressComponents)
            .then(response => {
                res.json({ result: "success", data: response });
            })
            .catch(error => {
                console.log(error);
                res.json({ result: "error", data: error });
            });
    });
});

// Returns promise of DigitalAddress
function GetDigitalAddress(lat, lon, address_comps) {
    let info = new Promise((resolve, reject) => {
        // Get Region
        region = GetRegion(address_comps);

        // Get District
        district = GetDistrict(address_comps);

        // Get Center of District
        geo.Geocode(district)
            .then(geoinfo => {
                // Find distance from the point to center of district
                distToCenter = geo.GetDistanceBetween(lat, lon, geoinfo.lat, geoinfo.lng);

                // Convert distance to postcode
                postCode = toolbox.zeroFill(Math.ceil(distToCenter / 500), 4);

                // Create unique address - Generates random number between 1 and 9999
                unique = toolbox.zeroFill(CreateUniqueAddress(), 4);

                digitalAddress = region.substring(0, 1) + district.substring(0, 1) + "-" + postCode + "-" + unique;
                resolve(digitalAddress);
            })
            .catch(error => {
                reject(error);
            });
    });
    return info;
}

// Returns Region from geoinfo
function GetRegion(geoinfo) {
    return toolbox.Find("administrative_area_level_1", geoinfo);
}

// Returns District from geoinfo
function GetDistrict(geoinfo) {
    district = toolbox.Find("administrative_area_level_2", geoinfo);
    if (district) {
        return district;
    } else {
        return toolbox.Find("locality", geoinfo);
    }
}

function CreateUniqueAddress() {
    ad = Math.floor(Math.random() * 9999) + 1;
    return ad;
}
