const utils = (function () {
    const viewRenderPrefix = 'knack-view-render.';

// specifying View runs for each form reload. (don't use scene-render)
    function specifyView(view, func) {
        $(document).on(`${viewRenderPrefix}.${view}`, func);
    }

// specifying Scene runs for each form reload. (don't use scene-render)
    function specifyScene(scene, funk) {
        $(document).on('knack-scene-render.' + scene, funk);
    }

//set Date format MM/DD/YYYY
    function formatDate(dateString) {
        let date = new Date(dateString);
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    }

// calls a function when a field is clicked off
    function onBlur(fieldId, funk) {
        $(fieldId).blur(function () {
            funk($(this).val());
        });
    }

//rounding decimal values
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

//getting regions by entered zip code
    function getRegionByZipCode(ztpCode, success) {
        $.ajax({
            url: `https://ajt-sandbox.herokuapp.com/inContact/zips?zip=${ztpCode}`,
            type: 'GET',
            dataType: 'text',
            success: success,
            error: (error) => console.log(error, 'error on getting regions by ZIP code'),
            beforeSend: (xhr) => xhr.setRequestHeader("Content-Type", "application/json")
        });
    }

//removes all characters and spaces from a string
    function removeCharAndSpaces(str) {
        return str.replace(/[`~!@#$%^&*()/ /_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '');
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

// creates an email with phone number before @ sign if email doesn't exist
    function formatEmail(emailId, phoneId) {
        var phone = $(phoneId).val();
        if ($(emailId).val().length < 5 & phone.length > 5) {
            var generatedEmail = "+1" + removeCharAndSpaces(phone) + "@hubspot.com";
            $(emailId).val(generatedEmail);
        }
    }

//USA phone number masking (000) 000-0000
    function setPhoneNumberMask(fields = []) {
        const isNumericInput = (event) => {
            const key = event.keyCode;
            return ((key >= 48 && key <= 57) || // Allow number line
                (key >= 96 && key <= 105) // Allow number pad
            );
        };

        const isModifierKey = (event) => {
            const key = event.keyCode;
        return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
            (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
            (key > 36 && key < 41) || // Allow left, up, right, down
            (
                // Allow Ctrl/Command + A,C,V,X,Z
                (event.ctrlKey === true || event.metaKey === true) &&
                (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
            )
    };

    const enforceFormat = (event) => {
        // Input must be of a valid number format or a modifier key, and not longer than ten digits
        if (!isNumericInput(event) && !isModifierKey(event)) {
            event.preventDefault();
        }
    };

        const formatToPhone = (event) => {
            if (isModifierKey(event)) {
                return;
            }
            let position = event.target.selectionStart;

            // I am lazy and don't like to type things more than once
            const target = event.target;
            const input = target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
            const zip = input.substring(0, 3);
            const middle = input.substring(3, 6);
            const last = input.substring(6, 10);
            const fixedPositions = [2, 3, 4];

            if (fixedPositions.includes(position)) {
                return false
            }

            if (input.length > 6) {
                target.value = `(${zip}) ${middle}-${last}`;
            } else if (input.length > 3) {
                target.value = `(${zip}) ${middle}`;
            } else if (input.length > 0) {
                target.value = `(${zip}`;
            }
        };

        fields.forEach(field => {
            const inputElement = document.getElementById(field);
            inputElement.addEventListener('keydown', enforceFormat);
            inputElement.addEventListener('keyup', formatToPhone);
        })
    }

// putting her cause only used in add expense form but could be used globally.
    function getNum(fieldID) {
        var newNum = $(fieldID).val().replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        return +newNum;
    }

//hide empty tables
    function hideTableIfEmpty(tableViewId) {
        if (isTableEmpty(tableViewId)) {
            $(tableViewId).hide();
        }
    }

//disable HTML defulat autosuggest for phone fields
    function disableInputDefaultAutoSuggest(fields = []) {
        fields.forEach(field => {
            let el = document.getElementById(field);
            el.setAttribute('autocomplete', 'off');
        })
    }

//add dashes
    function setPhoneNumberFormat(input) {
        var x = input.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        input.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }

//html element attributes for phone number design in web and mobiile
    function initPhoneNumberConfigs(fields = []) {
        fields.forEach(field => {
            let phoneNumber = document.getElementById(field);
            phoneNumber.setAttribute('maxlength', 14);
            phoneNumber.setAttribute('type', 'tel');
            phoneNumber.setAttribute('pattern', '^\d{3}-\d{3}-\d{4}$');
        })
    }

    function createContact(record, view) {
        //var data = formatRecord(record) ;
        if (view) {
            showCustomerInfoInConfirmationMessage(record, view)
        }
        sendCreateContactRequest(JSON.stringify(record));
    }

    //Adding user credentials on Leads/Quicksets submit
    function showCustomerInfoInConfirmationMessage(record, view) {
        setTimeout(() => {
            let name = document.createElement("p");
            name.innerHTML = 'Name: ' + record.field_1_raw.first + ' ' + record.field_1_raw.last;

            let phoneNumber = document.createElement("p");
            phoneNumber.innerHTML = 'Phone Number: ' + record.field_25_raw.formatted;

            let email = document.createElement('p');
            email.innerHTML = 'Email: ' + record.field_26_raw.email;

            let address = document.createElement('p');
            address.innerHTML = 'Adress: ' + record.field_73_raw;

            let city = document.createElement('p');
            city.innerHTML = 'City: ' + record.field_75_raw;

            let state = document.createElement('p');
            state.innerHTML = 'State: ' + record.field_76_raw;

            $('#' + view +' .kn-form-confirmation .success').append(name, phoneNumber, email, address, city, state);
        })
    }

    function sendCreateContactRequest(data){
        $.ajax({
            type: 'POST',
            url: 'https://ajt-sandbox.herokuapp.com/knack',
            headers: {"content-type": "application/json"},
            data: data,
            success: function(){
                console.log('hello')
            },
            failure: function(error){
                console.log(error);
            }
        });
    }

    // adds functionality to search city and state data based off zip code
    function onZipCodeBlur( zipFieldId, cityFieldId, stateFieldId, availableCitiesId, modal) {
        var selectId = "#view_2-field_24";
        onBlur( zipFieldId , function( zip ) {
            //if (getRegion && !$('#field_507').val()) {
            getRegionByZipCode(zip, (res) => {
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

            if(	zip.replace(/ /g,'').length === 5 & $(cityFieldId).val().length < 3	){
                getZipCodeAddressInfo( zip , function( res ){
                    var data = getCityAndState( res, cityFieldId );
                    var cities = data[0] ;
                    $(stateFieldId).val( data[1] );
                    $(cityFieldId).val( cities[0] );
                    setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId );
                });
            }
        });
    }

    function setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId){
        $(availableCitiesId).children('option').remove();
        $.each(cities, function(index, locality){
            var $option = $(document.createElement('option'));
            $option.html(locality);
            $option.attr('value',locality);
            if(index == 0) {
                $option.attr('selected','selected');
            }
            $(availableCitiesId).append($option);

        });

    }

    function isTableEmpty(tableViewId){
        console.log(tableViewId + " tbody tr");
        console.log($(tableViewId + " tbody tr"));
        return $(tableViewId + " tbody tr").hasClass('kn-tr-nodata');
    }

    function showAlertOnClickIfTableIsEmpty(buttonClass, tableViewId, message){
        $(buttonClass).on('click',function(){
            if( isTableEmpty(tableViewId) ){
                alert(message);
                return false ;
            }
        });
    }

    function showAlertOnClickIfTableIsNotEmpty(buttonClass, tableViewId, message){
        $(buttonClass).on('click',function(){
            if( ! isTableEmpty(tableViewId) ){
                alert(message);
                return false ;
            }
        });
    }

    //adding dash formatted text to source code filed
    function addDashForSource(input) {
        let str = input.value;
        if (str && str.length >= 2) {
            str = str.split('-').join('');
            input.value = str.substring(0, 2) + "-" + str.substring(2, str.length);
        }
    }

    // updates the user to the most recent version of the app by reloading the page and updating their user record.
    function updateUserVersion(userId, updatedVersion){
        var d = {
            "field_362": updatedVersion
        };
        $.ajax({
            url:"https://api.knack.com/v1/objects/object_4/records/" + userId,
            type:"PUT",
            headers: {
                "X-Knack-Application-Id": "5ae163cf99f0812865bce773",
                "X-Knack-REST-API-KEY":"71e543b0-a1af-11e9-b051-1fb54b980f24",
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(d),
            success: function(data){
                location.reload(true);
            },
            error: function(request,error){
                console.log(error);
            }
        });
    }

// checks the users version of the app then updates it if its not the most recent
    function checkVersion() {
        $.ajax({
            url:"https://api.knack.com/v1/objects/object_31/records",
            type:"GET",
            headers: {
                "X-Knack-Application-Id": "5ae163cf99f0812865bce773",
                "X-Knack-REST-API-KEY":"71e543b0-a1af-11e9-b051-1fb54b980f24",
                'Content-Type': 'application/json'
            },
            success: function(data){
                if(Knack.getUserAttributes().values.field_362 != data.total_records){
                    updateUserVersion( Knack.getUserAttributes().id, data.total_records ) ;
                } else {
                    console.log('is flase');
                }
            },
            error: function(request,error){
                console.error(error);
            }
        });
    }

    // returns the zip, city and state from the address info returned by google
    function getAddressInfo(response, cityFieldId) {
        var cities = '' ;
        var state= '' ;
        var zip = '' ;
        var address_components = response.results[0].address_components;
        if (response.results[0].postcode_localities && response.results[0].postcode_localities.length > 1) {
            let modalTtitle = 'Please pick the correct city';
            modal.formModal(response.results[0].postcode_localities, 'radio', modalTtitle, cityFieldId)
        }
        $.each(address_components, function(index, component){
            var types = component.types;
            // loops through address results array
            $.each(types, function(index, type){
                // sets the value of the city
                if(response.results[0].hasOwnProperty('postcode_localities')){
                    cities = response.results[0].postcode_localities ;
                }else if (type == 'locality' || type == 'neighborhood') {
                    cities = [component.long_name];
                }
                // sets value of the state
                if(type == 'administrative_area_level_1') {
                    state = component.short_name;
                }
                if( type == 'postal_code'){
                    zip = component.short_name ;
                }
            });
        });
        return [zip, cities, state];
    }

    function getCityAndState(res, cityFieldId) {
        var data = getAddressInfo(res, cityFieldId);
        var cities = data[1];
        var state = data[2];
        return [ cities , state ] ;
    }

    return {
        round,
        getNum,
        onBlur,
        formatDate,
        formatEmail,
        specifyView,
        onZipCodeBlur,
        checkVersion,
        isTableEmpty,
        showAlertOnClickIfTableIsEmpty,
        showAlertOnClickIfTableIsNotEmpty,
        createContact,
        hideTableIfEmpty,
        setPhoneNumberMask,
        getRegionByZipCode,
        removeCharAndSpaces,
        setPhoneNumberFormat,
        capitalizeFirstLetter,
        initPhoneNumberConfigs,
        disableInputDefaultAutoSuggest
    }
})();