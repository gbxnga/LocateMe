var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error, options);
    } else {
        $("#dstatus").text("Geolocation is not supported");
    }
}

function getAddress(latitude,longitude) {
    
    latlon = {
        lat: latitude,
        lon: longitude
    }

    url = "http://localhost:3000/address";

    var formBody = [];

    for (var k in latlon) {
        var encocdedKey = encodeURIComponent(k);
        var encocedValue = encodeURIComponent(latlon[k]);
        formBody.push(encocdedKey + "=" + encocedValue);
    }

    formBody = formBody.join("&");

    let fetchData = {
        method: 'POST',
        body: formBody,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }

    fetch(url, fetchData)
        .then(res => res.json())
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            $("#dstatus").text(error);
        })
}

function showPosition(position) {
    console.log(position.coords);
    $("#dstatus").text("(" + position.coords.latitude + " , " + position.coords.longitude + ") - Accuracy: " + position.coords.accuracy + " meters");

    getAddress(position.coords.latitude,position.coords.longitude);

}