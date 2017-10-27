// Load api key from .env file
require('dotenv').config();

// Create a google maps client with apikey from environment
var googleMapsClient = require('@google/maps').createClient({key: process.env.API_KEY});

var express= require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// Required to allow client-side to make request to this server
var cors = require('cors');
app.use(cors());

// Enable reading POST data from forms
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the frontend stuff
app.use(express.static(path.join(__dirname, 'public')));


// Main Route
app.get('/', function(req,res){
    res.sendFile("index.html");
});

// Returns the Digital Address of GPS
app.post('/address',function(req,res){
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);

    googleMapsClient.reverseGeocode({
        latlng: [lat, lon]
    }, function (err, response) {
        if (!err) {
            res.json(response.json.results[0]);
        } else {
            res.json("error");
        }
    });
})

app.listen(3000,function(){
    console.log("Listening on Port 3000");
})
