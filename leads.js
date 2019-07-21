const leads = (function () {

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

    //listenting to element input value changes
    function listenToInputFieldValueChange(fieldName) {
        document.getElementById('field_25').onpaste = function() {
            setTimeout(() => {
                initModalForLeadSearch.call(this);
            }, 0)
        };
        $(fieldName).on('keyup', function (e) {
            if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105) {
                initModalForLeadSearch.call(this);
            }
        });
    }

    //shows the Leads information in the modal
    function initModalForLeadSearch() {
        if (this.value && this.value.replace(/[^0-9]/g, "").length === 10) {
            let value = this.value.replace(/[- )(]/g, '');
            $.ajax({
                url: `https://ajt-sandbox.herokuapp.com/inContact/queryhubspot?phone=${value}`,
                type: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    initUserInfoModal = function (data, modalTitle) {
                        const customorData = [
                            {key: 'email', displayName: 'Email', value: ''},
                            {key: 'firstname', displayName: 'First Name', value: ''},
                            {key: 'lastname', displayName: 'Last Name', value: ''},
                            {key: 'addy', displayName: 'City', value: ''},
                            {key: 'staress', displayName: 'Address', value: ''},
                            {key: 'citte', displayName: 'State', value: ''},
                            {key: 'hs_opportunity_status', displayName: 'Opportunity Status', value: ''},
                            {key: 'appointment_date', displayName: 'Appointment Date', value: '', isDate: true},
                        ];
                        customorData.forEach((item, index) => {
                            if (data[item.key]) {
                                item.value = item.isDate ? (new Date(+data[item.key].value)).toDateString() : data[item.key].value
                            } else {
                                customorData.splice(index, 1)
                            }
                        });
                        //modal functionality
                        modal.infoModal(customorData, modalTitle);
                    };

                    if (res.length) {
                        const data = res[0].properties;
                        data.appointment_date ?
                            initUserInfoModal(data, getMessage(data, true)) : initUserInfoModal(data, getMessage(data, false));
                    }
                },
                error: function (request, error) {
                    console.log('Error on checking phone number create', error);
                }
            });
        }
    }

    //sets the midakl content message
    function getMessage(data, hasAppointment) {
        return hasAppointment ?
            `This prospect already has a scheduled appointment for
	${(new Date(+data.appointment_date.value)).toDateString()} at ${data.appointment_time.value}.
	Please let ${data.firstname.value} know that we look forward to seeing them! 
	Please do not call this in as a Quickset!`:
            `This prospect already exists in our system, if they would like to set a Quickset, please call it in now using the phone number they provided.`
    }

    function onZipCodeBlur( zipFieldId, cityFieldId, stateFieldId, availableCitiesId, getRegion = false) {
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
            })

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

    function fixTld(emailId) {
        var email = $(emailId).val();

        // splits email after the @ sign
        var emailEnd = email.slice( email.indexOf("@") );
        var hasTld = emailEnd.indexOf(".") !== -1 ;
        var tld = hasTld ? emailEnd.slice(emailEnd.indexOf(".") + 1 ).toLowerCase() : "" ;
        var isTldValid =  tld === "com" || tld === "net" || tld === "edu" || tld === "org" ;

        // runs if email contains an @ sign and the tld is valid
        if( ! isTldValid && email.indexOf("@") !== -1 ){
            var newTld = emailEnd.includes(".")? "" : ".";
            if (tld[0] === "n") { newTld = newTld + "net";  }
            if (tld[0] === "e") { newTld = newTld + "edu";  }
            if ( tld[0] === "o" ) { newTld = newTld + "org";  };
            if(tld[0] !== "o" || tld[0] !== "e" || tld[0] !== "n" ){ newTld = newTld + "com"; };
            var newEmail = hasTld ? email.substr (0 , email.indexOf(".", email.indexOf("@") ) + 1 ) + newTld : email + newTld ;
            $(emailId).val(newEmail);
        }
    }

    //value":"06/07/2019"
    function getLeadsListing() {
        let filters = {
            rules: [
                //{
                //  "field":"field_344",
                //  "operator":"is",
                //   "value":"06/01/2019"
                //  },
                {
                    "match":"and",
                    "field":"field_565",
                    "operator":"is blank",
                    "field_name":"Knack Id"
                },
                {
                    "field":"field_344",
                    "operator":"is after",
                    "value":"05/30/2019"
                },
                {
                    "field":"field_344",
                    "operator":"is before",
                    "value":"07/01/2019"
                }
            ]
        }

        let api_url = `https://api.knack.com/v1/objects/object_1/records?page=${leadesPage++}&rows_per_page=${rowsPerPage}&filters=` + encodeURIComponent(JSON.stringify(filters));

        $.ajax({
            url: api_url,
            dataType: 'json',
            type: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Knack.getUserToken(),
                "X-Knack-Application-Id": Knack.application_id,
                "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
            },
            success: function (res) {
                let items = res.records;
                let index = 0;

                var doAsyncThing = function (recordId) {
                    return updateKnackid(recordId)
                };

                var recursivelyDoAsyncThing = function (recordId) {
                    console.log('current index', index)
                    return doAsyncThing(recordId).then(function (response) {
                        return new Promise(function (resolve, reject) {
                            index++;
                            //do something with response
                            if (index < items.length) {
                                //get newlastId
                                return resolve(recursivelyDoAsyncThing(items[index].id));
                            } else {
                                resolve();
                            }
                        });
                    });
                };

                recursivelyDoAsyncThing(items[index].id).then(function () {
                    console.log('Done! all records updated successfully');
                    if (leadesPage <= res.total_pages) {
                        getLeadsListing();
                    }
                });

            },
            error: function (request, error) {
                console.log(error)
            }
        });
    }

    function updateKnackid(knackId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `https://api.knack.com/v1/objects/object_1/records/${knackId}`,
                dataType: 'json',
                type: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Knack.getUserToken(),
                    "X-Knack-Application-Id": Knack.application_id,
                    "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
                },
                data: JSON.stringify({"field_565": knackId}),
                success: function (res) {
                    resolve(res)
                },
                error: function (request, error) {
                    resolve(updateKnackid(knackId))
                    //reject(error)
                }
            });
        });
    }

    return {
        fixTld,
        onZipCodeBlur,
        getLeadsListing,
        listenToInputFieldValueChange
    }
})();