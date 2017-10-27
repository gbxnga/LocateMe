var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBKC0Fis9NK3KYx9X11UbIp6yxLxsUjxlE'
});
var express= require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors());

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req,res){
    res.send("Hello World");
});

app.post('/address',function(req,res){
    console.log("address!==========================>");
    console.log(req.body);
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    
    console.log(lat);
    console.log(lon);
    
    googleMapsClient.reverseGeocode({
        latlng: [parseFloat(lat), parseFloat(lon)]
    }, function (err, response) {
        if (!err) {
            res.json(response.json.results[0]);
        } else {
            res.json("error");
        }
    });
})

app.listen(3000,function(){

})
