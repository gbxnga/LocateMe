$(document).ready(function () {
    txtAddress = $("#address");
    txtStatus = $("#status");
})

function getLocation() {

    // Check if geolocation is supported
    if (navigator.geolocation) {

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition(showPositionAndGetDAddress, error, options);

    } else {
        txtStatus.text("Geolocation is not supported");
    }
}

function showPositionAndGetDAddress(position) {
    position = position.coords;
    txtStatus.text("[" + position.latitude + " , " + position.longitude + "]  " + position.accuracy + "m");
    getDAddress(position.latitude, position.longitude);

}

function error(err) {
    console.warn("Error occured in getting location");
}

function getDAddress(latitude, longitude) {

    latlon = {
        lat: latitude,
        lon: longitude
    }

    url = "http://localhost:3000/address";

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(latlon),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            txtAddress.text(response.data);
        },
        failure: function (error) {
            txtAddress.text("Error Occurred");
        }
    })
}