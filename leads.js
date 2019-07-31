const leads = (function () {

    const lead = (function () {
        var emailId = "#field_26" ;
        var zipId = "#field_79";
        var cityId = "#field_75";
        var stateId = "#view_152-field_76";
        var availableCitiesId = "#view_152-field_194";

        $('#kn-input-field_507 label span').remove();
        $('#field_507').hide();

        $(emailId).on("blur", function(){
            if( $(emailId).val().length > 4 && $(emailId).val().indexOf("@")!== -1) {
                fixTld(emailId);
            }
        });

        function init(utils, modal, map) {
            utils.onZipCodeBlur( zipId, cityId, stateId, availableCitiesId, modal );
            utils.initPhoneNumberConfigs(['field_25', 'field_77']);
            utils.setPhoneNumberMask(['field_25', 'field_77']);
            //disable HTML input default autosuggestions
            utils.disableInputDefaultAutosuggest(['first', 'last']);
            // this checks version on qs form
            utils.checkVersion();
            listenToInputFieldValueChange('#field_25', modal);
        }

        return {
            init
        }
    });

    const quickSet = (function () {
        var phoneId = "#field_25" ;
        var emailId = "#field_26" ;
        var zipId = "#field_79";
        var cityId = "#field_75";
        var stateId = "#view_103-field_76";
        var availableCitiesId = "#view_103-field_194";

        $('#kn-input-field_507 label span').remove();
        $('#field_507').hide();
        listenToInputFieldValueChange('#field_25');

        // updates email tld if not proper
        $(emailId).on("blur", function() {
            if( $(emailId).val().length > 4 && $(emailId).val().indexOf("@")!== -1) {
                fixTld(emailId);
            }
        });

        // formats email using phone number if email doesn't exist
        $(".kn-button").on("click", function() {
            formatEmail(emailId, phoneId);
            $(phoneId).val( removeCharAndSpaces(	$(phoneId).val()	) ) ;
            return true;
        });

        //Show Customer info on Quicksets create
        $(document).on('knack-record-create.view_103', function(event, view, record) {
            showCustomerInfoInConfirmationMessage(record, 'view_103')
        });

        function init(utils, modal, map) {
            utils.onZipCodeBlur( zipId, cityId, stateId, availableCitiesId, modal );
            utils.initPhoneNumberConfigs(['field_25', 'field_77']);
            utils.setPhoneNumberMask(['field_25', 'field_77']);
            //disable HTML default auto suggest for phone fields
            utils.disableInputDefaultAutosuggest(['first', 'last']);

            // this makes sure the most recent version is used for lead form
            utils.checkVersion();
        }

        return {
            init
        }
    })();

    //Adding user credentials on Leads/Quicksets submit this method also in Utils
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
    function listenToInputFieldValueChange(fieldName, modal) {
        document.getElementById('field_25').onpaste = function() {
            setTimeout(() => {
                initModalForLeadSearch.call(this, modal);
            }, 0)
        };
        $(fieldName).on('keyup', function (e) {
            if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105) {
                initModalForLeadSearch.call(this, modal);
            }
        });
    }

    //shows the Leads information in the modal
    function initModalForLeadSearch(modal) {
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

    return {
        lead,
        quickSet,
    }
})();