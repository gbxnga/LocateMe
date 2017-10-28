// Load api key from .env file
require('dotenv').config();

// Create a google maps client with apikey from environment
var googleMapsClient = require('@google/maps').createClient({
    key: process.env.API_KEY
});

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Required to allow client-side to make request to this server
var cors = require('cors');
app.use(cors());

// Enable reading POST data from forms
app.use(bodyParser.json());

// Setting up the path to frontend
app.use(express.static(require('path').join(__dirname, 'public')));

// Start the server
app.listen(3000, function () {
    console.log("Listening on Port 3000");
})


// Main Route
app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.post('/test',function(req,res){
    console.log(req.body);
    res.json('correct');
})

// Returns the Digital Address of GPS
app.post('/address', function (req, res) {

    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    console.log('Checking for [' + lat + ',' + lon + ']');

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
            console.log(ad);
            GetDigitalAddress(lat, lon, ad)
                .then(
                (response) => { res.json({ result: "success", data: response }) }
                )
                .catch(
                (error) => { res.json({ result: 'error', data: error }) }
                )
        })
})

function GetDigitalAddress(lat, lon, address_comps) {

    let info = new Promise((resolve, reject) => {
        region = GetRegion(address_comps);
        district = GetDistrict(address_comps);

        GetCenterOfDistrict(district)
            .then(
            (center) => {
                distToCenter = GetDistanceBetween(lat, lon, center.lat, center.lng);
                postCode = (zeroFill(Math.ceil(distToCenter / 500), 4));

                resolve(region.substring(0, 1) + district.substring(0, 1) + '-' + postCode);
            }
            )
            .catch(
            (error) => {
                reject(error);
            }
            )
    })
    return info
}

// Returns Region from geoinfo
function GetRegion(geoinfo) {
    return (Find('administrative_area_level_1', geoinfo));
}

// Returns District from geoinfo
function GetDistrict(geoinfo) {
    district = Find('administrative_area_level_2', geoinfo);
    if (district) {
        return district;
    } else {
        return Find('locality', geoinfo);
    }
}

// Returns GPS Coordinates for Center of a district
function GetCenterOfDistrict(district) {
    return Geocode(district)
}

// Returns distance between two GPS points
function GetDistanceBetween(lat1, lon1, lat2, lon2) {
    // console.log("Getting Distance between " + lat1 + "," + lon1 + " and " + lat2 + "," + lon2);
    return parseInt(getDistanceFromLatLonInM(lat1, lon1, lat2, lon2));
}

// Generates a 4-digit ID for the space
function GenerateUniqueAddress(lat, lon) {

}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function Find(term, obj) {
    result = null;
    for (var i in obj) {
        if (obj[i].types.includes(term)) {
            result = obj[i].long_name
            return result;
        }
    }
    return result;
}

// Returns promises of a geoencode object
function Geocode(d_address) {
    let info = new Promise((resolve, reject) => {
        googleMapsClient.geocode({
            address: d_address
        }, function (err, response) {
            if (!err) {
                geoinfo = response.json.results[0].geometry.location;
                resolve(geoinfo);
            } else {
                reject(err);
            }
        })
    });

    return info;
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}