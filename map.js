const map = (function () {
    // this message is shown if there is an error sending an api request to google
    var errorMessage = "Can't search city and state right now, enter it manually if known.";

    // sends request to geocode api for address info based on latidude and longitude
    function getLatAndLngAddressInfo(lat , lng, success) {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +"," + lng +'&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(res) {
            success(res);
        });
    }

    // sends request to geocode api for address info based on address city and state and if no address is provide it searches for the zip by lat and lng.
    function getCityStateAddressInfo(address, city, state, success) {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',' + city + ',' + state + '&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(res){

            // api doesn't return zip when only city and state are provided so have to take the lat and long and send another request to get zip.
            if( ! checkForZipCode( res ) ) {
                var lat = res.results[0].geometry.location.lat ;
                var lng = res.results[0].geometry.location.lng;
                getLatAndLngAddressInfo(lat , lng , success);
            } else {
                success(res);
            }
        });
    }

    // goes through the response sent back by google and checks if a zip code exists
    function checkForZipCode( response ) {
        var zip = '' ;
        var address_components = response.results[0].address_components;
        $.each(address_components, function(index, component){
            var types = component.types;

            // loops through address results array
            $.each(types, function(index, type){
                if( type === 'postal_code') {
                    zip = component.short_name ;
                }
            });
        });
        return !!zip;
    }

    // sends api request for address info based on a zip code
    function getZipCodeAddressInfo(zip, success, noResults, error) {
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(response){
            // checks for a valid zip code.
            if( response.status === "OK" ){
                success( response );
            }
        }).error(function(response){
            // shows api error message
            alert(errorMessage);
        });
    }

    //getting regions by entered zip code
    function getRegionByZipCode(ztpCode, success) {
        $.ajax({
            url: `https://ajt-sandbox.herokuapp.com/inContact/zips?zip=${ztpCode}`,
            type: 'GET',
            dataType: 'text',
            success: success,
            error: (error) => console.log(error, 'error on getting regions by ZIP code'),
            beforeSend: (xhr) =>  xhr.setRequestHeader("Content-Type","application/json")
        });
    }

    return {
        getLatAndLngAddressInfo,
        getCityStateAddressInfo,
        getZipCodeAddressInfo,
        getRegionByZipCode
    }
})();