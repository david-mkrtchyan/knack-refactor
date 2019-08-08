const referral = (function () {
    let utils, modals, map, mask = {};

    function hideSalesPersonFieldIfExist() {
        let api_url = 'https://api.knack.com/v1/objects/object_25/records';
        let filters = [
            {
                field: "field_296",
                operator: "is",
                value: Knack.user.attributes.values.email.email,
            }
        ];
        api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
        setTimeout(() => Knack.showSpinner());
        $.ajax({
            url: api_url,
            dataType: 'json',
            type: "GET",
            headers: window.knackApiHeaders,
            success: function (res) {
                if (res.records[0].field_307_raw.length) {
                    $('#kn-input-field_343').hide();
                }
                Knack.hideSpinner();
            },
            error: function ( request, error ) {
                Knack.hideSpinner();
            }
        });
    }

    function init(_utils, _modal, _map, _mask) {
        utils = _utils;
        modals = _modal;
        map = _map;
        mask = _mask;
        hideSalesPersonFieldIfExist();
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

    return {
        init,
        createContact
    }
})();