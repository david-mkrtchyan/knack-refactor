const leadsHelper = (function () {

    function onZipCodeBlur( zipFieldId, cityFieldId, stateFieldId, availableCitiesId, modal, map, utils) {
        var selectId = "#view_2-field_24";
        utils.onBlur( zipFieldId , function( zip ) {
            //if (getRegion && !$('#field_507').val()) {
            map.getRegionByZipCode(zip, (res) => {
                if (res[0] === 'R' && res.length <= 3) {
                    $('#field_507').val(res);
                } else {
                    $('#field_507').val('');
                    //if there is no Cities with current ZIP-CODE then showing this message;
                    if (zip) {
                        let modalTtitle = 'Area Not Serviced';
                        modal.infoModal([], modalTtitle, 'Sorry we do not service this Zip code')
                    }
                }
            });

            if(	zip.replace(/ /g,'').length === 5 && $(cityFieldId).val().length < 3	){
                map.getZipCodeAddressInfo( zip , function( res ){
                    var data = getCityAndState( res, cityFieldId, modal );
                    var cities = data[0] ;
                    $(stateFieldId).val( data[1] );
                    $(cityFieldId).val( cities[0] );
                    setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId );
                });
            }
        });
    }

    function setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId) {
        $(availableCitiesId).children('option').remove();
        $.each(cities, function(index, locality) {
            var $option = $(document.createElement('option'));
            $option.html(locality);
            $option.attr('value',locality);
            if(index === 0) {
                $option.attr('selected','selected');
            }
            $(availableCitiesId).append($option);
        });
    }

    // returns the zip, city and state from the address info returned by google
    function getAddressInfo(response, cityFieldId, modal) {
        var cities = '';
        var state = '';
        var zip = '';
        var address_components = response.results[0].address_components;
        if (response.results[0].postcode_localities && response.results[0].postcode_localities.length > 1) {
            let modalTtitle = 'Please pick the correct city';
            modal.formModal(response.results[0].postcode_localities, 'radio', modalTtitle, cityFieldId)
        }
        $.each(address_components, function (index, component) {
            var types = component.types;
            // loops through address results array
            $.each(types, function (index, type) {
                // sets the value of the city
                if (response.results[0].hasOwnProperty('postcode_localities')) {
                    cities = response.results[0].postcode_localities;
                } else if (type === 'locality' || type === 'neighborhood') {
                    cities = [component.long_name];
                }
                // sets value of the state
                if (type === 'administrative_area_level_1') {
                    state = component.short_name;
                }
                if (type === 'postal_code') {
                    zip = component.short_name;
                }
            });
        });
        return [zip, cities, state];
    }

    function getCityAndState(res, cityFieldId, modal) {
        var data = getAddressInfo(res, cityFieldId, modal);
        var cities = data[1];
        var state = data[2];
        return [cities, state];
    }

    return {
        onZipCodeBlur,
        getAddressInfo,
    }

})();