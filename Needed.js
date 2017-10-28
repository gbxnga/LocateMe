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