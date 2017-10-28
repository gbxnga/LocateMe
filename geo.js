require('dotenv').config();

var googleMapsClient = require('@google/maps').createClient({
    key: process.env.API_KEY
});

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module.exports = {
    
    GetDistanceBetween : function(lat1,lon1,lat2,lon2){
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return parseInt(d * 1000); //Distance in whole number and m
    },

    Geocode : function(address){
        let info = new Promise((resolve, reject) => {
            googleMapsClient.geocode({
                address: address
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
}

