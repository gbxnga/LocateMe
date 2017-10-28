// Load api key from .env file
require('dotenv').config();

// Create a google maps client with apikey from environment
var googleMapsClient = require('@google/maps').createClient({key: process.env.API_KEY});

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Required to allow client-side to make request to this server
var cors = require('cors');
app.use(cors());

// Enable reading POST data from forms
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting up the frontend stuff
app.use(express.static(require('path').join(__dirname, 'public')));


// Main Route
app.get('/', function (req, res) {
    res.sendFile("index.html");
});

// Returns the Digital Address of GPS
app.post('/address', function (req, res) {
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);

    let info = new Promise((resolve, reject) => {
        googleMapsClient.reverseGeocode({
            latlng: [lat, lon]
        }, function (err, response) {
            if (!err) {
                geoinfo = response.json.results[0];
                resolve(geoinfo);
            } else {
                reject(err);
            }
        })
    });

    info.then(
        function (geoinfo) {
            ad = geoinfo.address_components;
            console.log(GetRegion(geoinfo));
            res.json(ad)
        }
    )
        .catch(
        function (reason) {
            console.log(reason)
            res.json(reason);
        }
        )
})

app.listen(3000, function () {
    console.log("Listening on Port 3000");
})

// Returns Region from geoinfo
function GetRegion(geoinfo){
   
}

// Returns District from geoinfo
function GetDistrict(geoinfo){
   
}

// Returns GPS Coordinates for Center of a district
function GetCenterOfDistrict(district){

}

// Returns distance between two GPS points
function GetDistanceBetween(lat1,lon1,lat2,lon2){

}

// Generates a 4-digit ID for the space
function GenerateUniqueAddress(lat,lon){

}

// Tool to search for element in JSON object
function FindInAddress(term, ad) {
    found = false;
    item = "";

    for (var address in ad) {
        if (ad[address].types.includes(term)) {
            found = true;
            item = ad[address].long_name;
        }
    }

    return [found,item];
}

