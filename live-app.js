//when the user clicks off of the zip field the city and state form fields will be filled.

// this message is shown  if the zip code is not a valid zip code.

var invalidZipMessage = "Invalid Zip Code";

// this message is shown if there is an error sending an api request to google

var errorMessage = "Can't search city and state right now, enter it manually if known.";
var payrollSearchQuery = '';
//payroll filters data copyed to payfol.js file
var payrollStartDate = new Date('02/01/2019');
var currentDate = new Date();
var payrollDateRangeFilter = {from: payrollStartDate, to: currentDate};
//--------------------------------------------------

//get leads and add lead_id to KNack DB Lead Id field
specifyView('view_488', function () {
    //getLeadsListing();
})



//----------------------------------------------------

//add Referral page, check if auth user has sales person or not
//Advocate submit lead view
specifyView('view_414', function () {
    // let api_url = 'https://api.knack.com/v1/objects/object_25/records';
    // let filters = [
    //     {
    //         field: "field_296",
    //         operator: "is",
    //         value: Knack.user.attributes.values.email.email,
    //     }
    // ];
    // api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
    // setTimeout(() => Knack.showSpinner());
    // $.ajax({
    //     url: api_url,
    //     dataType: 'json',
    //     type: "GET",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': Knack.getUserToken(),
    //         "X-Knack-Application-Id": Knack.application_id,
    //         "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
    //     },
    //     success: function (res) {
    //         if (res.records[0].field_307_raw.length) {
    //             $('#kn-input-field_343').hide();
    //         }
    //         Knack.hideSpinner();
    //     },
    //     error: function ( request, error ) {
    //         Knack.hideSpinner();
    //     }
    // });
    initPhoneNumberConfigs(['field_25']);
    setPhoneNumberMask(['field_25']);
});
//------------------------------------------------------------------

//all code for Payrolls is unused code
//Sending request to Node server for merketers list NEW ADDED TABLE
specifyView('view_562', function () {
    // payrollDateRangeFilter = JSON.stringify({from: payrollStartDate, to: currentDate});
    //getInputFilterValue(); adds filters for Payroll period
    getPayrolls();
})
//-----------------------------------------------------------------

// //------ Jordan edited the following 2 functions to make it work using HRID instead of MKTREPNAME
// function getPayrolls() {
//
//     let userName = Knack.user.attributes.values.name;
//     let knackId =  Knack.user.attributes.id;
//
//     setTimeout(() => Knack.showSpinner(), 0)
//
//     let api_url = 'https://api.knack.com/v1/objects/object_5/records';
//     let filters = [
//         {
//             'field':'field_14', // Company connection field on Contact object
//             operator: "is",
//             value: Knack.user.attributes.values.email.email,
//         }
//     ];
//     api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
//     setTimeout(() => Knack.showSpinner());
//     $.ajax({
//         url: api_url,
//         dataType: 'json',
//         type: "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': Knack.getUserToken(),
//             "X-Knack-Application-Id": Knack.application_id,
//             "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
//         },
//         success: function (res) {
//             console.log(res)
//             getPayrollInfoFromZoho(res.records[0].field_102, userName)
//         },
//         error: function (request, error) {
//             Knack.hideSpinner();
//         }
//     });
// }
//
// function getPayrollInfoFromZoho(hrid, userName){
//     $.ajax({
//         url: "https://ajt-sandbox.herokuapp.com/zoho",
//         //url: "http://localhost:4000/api/v1/marketers",
//         dataType: 'json',
//         type: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: JSON.stringify({
//             //full_name: 'Cormier, Yvon',
//             full_name: `${userName.first}, ${userName.last}`,
//             'hrid': hrid,
//             date:  payrollDateRangeFilter,
//             date_range: {from: formatDate(payrollStartDate), to: formatDate(currentDate)}
//         }),
//         success: function (res) {
//             Knack.hideSpinner();
//             addRowsToPayrolsTable(res);
//         },
//         error: function (request, error) {
//             Knack.hideSpinner();
//         }
//     });
// }

// //listen to filter input value changes
// function getInputFilterValue() {
//     let view = document.querySelector('#view_562');
//
//     let filterContainer = document.createElement('div');
//     filterContainer.classList.add('filter-container');
//
//     let fromInputField = document.createElement('input');
//     fromInputField.setAttribute('placeholder', 'Select Start Date');
//     fromInputField.setAttribute('type', 'date');
//     fromInputField.setAttribute('name', 'from');
//
//     let toInputField = document.createElement('input');
//     toInputField.setAttribute('placeholder', 'Select End Date');
//     toInputField.setAttribute('type', 'date');
//     toInputField.setAttribute('name', 'to');
//
//     filterContainer.appendChild(fromInputField);
//     filterContainer.appendChild(toInputField);
//
//     [fromInputField, toInputField].forEach(input => {
//         input.oninput = function() {
//             payrollDateRangeFilter[input.getAttribute('name')] = input.value ? formatDate(input.value) : '';
//             getPayrolls();
//         }
//     })
//
//     //view.prepend(filterContainer);
//     view.insertBefore(filterContainer, view.children[1]);
// }

// // add marketer data to Paroll tabel
// function addRowsToPayrolsTable(tableData) {
//     let tbody = document.getElementById('view_562').querySelector('tbody');
//     tbody.innerHtml = '';
//     let headerColumns = [
//         {key: 'Payroll period', title: 'Payroll period'},
//         {key: 'Amount', title: 'Amount'},
//         {key: 'MKTREPNAME', title: 'Marketer Name'},
//         {key: 'ACTDATE', title: 'Date'},
//         {key: 'Description', title: 'Description'}
//     ];
//
//     //remove the default no results row if response has length
//     if (tableData.length) {
//         $(tbody).empty();
//     }
//
//     tableData.forEach(data => {
//         let tr = document.createElement('tr');
//         headerColumns.forEach((column, index) => {
//             let td = document.createElement('td');
//             td.classList.add('cell-edit');
//
//             let span = document.createElement('span');
//             span.classList.add('col-' + index);
//             span.innerText = data['' + column.key];
//
//             td.appendChild(span);
//             tr.appendChild(td);
//         }) // headerColumns foreach
//         tbody.appendChild(tr);
//     }) //table data ForEach
// }

// function formatDate(dateString) {
//     let date = new Date(dateString);
//     return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
// }

// function specifyScene(scene, funk){
//     $(document).on('knack-scene-render.' + scene , funk);
// }

// calls a function when a field is clicked off

// function onBlur(fieldId, funk){
//
//     $(fieldId).blur(function(){
//
//         var fieldValue = $(this).val();
//
//         funk( fieldValue );
//
//     });
//
// }

// function round(value, decimals) {
//     return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
// }

// //getting regions by entered zip code
// function getRegionByZipCode(ztpCode, success) {
//     $.ajax({
//         url: `https://ajt-sandbox.herokuapp.com/inContact/zips?zip=${ztpCode}`,
//         type: 'GET',
//         dataType: 'text',
//         success: success,
//         error: (error) => console.log(error, 'error on getting regions by ZIP code'),
//         beforeSend: (xhr) =>  xhr.setRequestHeader("Content-Type","application/json")
//     });
// }

// // sends request to geocode api for address info based on latidude and longitude
// function getLatAndLngAddressInfo(lat , lng, success) {
//     $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +"," + lng +'&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(res) {
//         success(res);
//     });
// }

// goes through the response sent back by google and checks if a zip code exists
// function checkForZipCode( response ) {
//     var zip = '' ;
//     var address_components = response.results[0].address_components;
//     $.each(address_components, function(index, component){
//         var types = component.types;
//
//         // loops through address results array
//         $.each(types, function(index, type){
//             if( type == 'postal_code'){
//                 zip = component.short_name ;
//             }
//         });
//     });
//     return zip == '' ? false : true ;
// }

// // sends request to geocode api for address info based on address city and state and if no address is provide it searches for the zip by lat and lng.
// function getCityStateAddressInfo(address, city, state, success) {
//     $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + ',' + city + ',' + state + '&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(res){
//
//         // api doesn't return zip when only city and state are provided so have to take the lat and long and send another request to get zip.
//         if( ! checkForZipCode( res ) ) {
//             var lat = res.results[0].geometry.location.lat ;
//             var lng = res.results[0].geometry.location.lng;
//             getLatAndLngAddressInfo(lat , lng , success);
//         }else{
//             success(res);
//         }
//     });
// }


// sends api request for address info based on a zip code
// function getZipCodeAddressInfo(zip, success, noResults, error){
//     $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyBn2wL7bwWCTcKR6Z-WVy3PRlWZIqKJLfg').success(function(response){
//         // checks for a valid zip code.
//         if( response.status === "OK" ){
//             success( response );
//         }
//     }).error(function(response){
//         // shows api error message
//         alert(errorMessage);
//     });
// }

// returns the zip, city and state from the address info returned by google
// function getAddressInfo(response, cityFieldId) {
//     var cities = '' ;
//     var state= '' ;
//     var zip = '' ;
//     var address_components = response.results[0].address_components;
//     if (response.results[0].postcode_localities && response.results[0].postcode_localities.length > 1) {
//         let modalTtitle = 'Please pick the correct city';
//         modal.formModal(response.results[0].postcode_localities, 'radio', modalTtitle, cityFieldId)
//     }
//     $.each(address_components, function(index, component){
//         var types = component.types;
//         // loops through address results array
//         $.each(types, function(index, type){
//             // sets the value of the city
//             if(response.results[0].hasOwnProperty('postcode_localities')){
//                 cities = response.results[0].postcode_localities ;
//             }else if (type == 'locality' || type == 'neighborhood') {
//                 cities = [component.long_name];
//             }
//             // sets value of the state
//             if(type == 'administrative_area_level_1') {
//                 state = component.short_name;
//             }
//             if( type == 'postal_code'){
//                 zip = component.short_name ;
//             }
//         });
//     });
//     return [zip, cities, state];
// }

// function getCityAndState(res, cityFieldId) {
//     var data = getAddressInfo(res, cityFieldId);
//     var cities = data[1];
//     var state = data[2];
//     return [ cities , state ] ;
// }

//removes all characters and spaces from a string
// function removeCharAndSpaces(str){
//
//     return str.replace( /[`~!@#$%^&*()/ /_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '');
// }

// function capitalizeFirstLetter(str){
//
//     return str.charAt(0).toUpperCase() + str.slice(1);
//
// }

// creates an email with phone number before @ sign if email doesn't exist
// function formatEmail(emailId, phoneId){
//     var phone = $(phoneId).val() ;
//
//     if ( $(emailId).val().length < 5 & 	phone.length > 5 ){
//
//         var generatedEmail =  "+1" + removeCharAndSpaces(	phone	) + "@hubspot.com" ;
//
//         $(emailId).val( generatedEmail );
//
//     }
// }

// formats source code by adding dash if it doesn't exist

// function formatSourceCode(sourceCodeId){
//     var formattedSourceCode =  $(sourceCodeId).val().toUpperCase();
//     if ( formattedSourceCode.length == 5){
//         formattedSourceCode = [formattedSourceCode.slice(0, 2), "-", formattedSourceCode.slice(2)].join('').toUpperCase();
//     }
//     $(sourceCodeId).val(formattedSourceCode) ;
// }

// // formats the form
// function formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId){
//     // adds phone to email if email doesn't exist
//     formatEmail(emailId, phoneId);
//     $(phoneId).val( removeCharAndSpaces(	$(phoneId).val()	) ) ;
//
//     // capitilize name first letters
//     $(firstNameId).val( capitalizeFirstLetter ( $(firstNameId).val() ) );
//     $(lastNameId).val( capitalizeFirstLetter ( $(lastNameId).val() ) );
//
//     //sets state and source code to uppercase
//     $( stateId ).val( $(stateId).val().toUpperCase()	);
//     $( sourceCodeId ).val(  $(sourceCodeId).val().toUpperCase());
//     formatSourceCode(sourceCodeId);
// }

// autocompletes the source date and contact date while being typed.

// function autocompleteDate(dateFieldId){
//     var dateInfo = new Date() ;
//     var month = dateInfo.getMonth() ;
//     var year= dateInfo.getFullYear();
//
//     $(dateFieldId).keyup(function(){
//         if ($(this).val().length == 2){
//             $(this).val($(this).val() + "/");
//         }else if ($(this).val().length == 5  ){
//             $(this).val($(this).val() + "/" + year);
//         }
//     });
// }

// creates the preset cookies
// function createCookies(){
//     // creates the preset cookies
//     $.cookie("sourceDatePreset",	$("#sourceDatePreset").val()	);
//     $.cookie("sourceCodePreset", $("#sourceCodePreset").val().toUpperCase() );
//     $.cookie("promoCodePreset", $("#promoCodePreset").val().toUpperCase()  );
//     $.cookie("marketerNamePreset", $("#marketerNamePreset").val() 	);
// }

// //  sets the all preset fields and form fields with the cookie for the preset.
// function setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId){
//     var sourceCode = $.cookie("sourceCodePreset");
//     var sourceDate = $.cookie("sourceDatePreset") ;
//     var promoCode = $.cookie("promoCodePreset");
//     var marketerName = $.cookie("marketerNamePreset" )  ;
//
//     //sets preset fields
//     $("#sourceCodePreset").val ( sourceCode );
//     $("#sourceDatePreset").val( sourceDate ) ;
//     $("#promoCodePreset").val( promoCode ) ;
//     $("#marketerNamePreset").val( marketerName ) ;
//
//     // sets form fields
//
//     $(sourceCodeId).val (  sourceCode ) ;
//
//     $(sourceDateId).val (  sourceDate ) ;
//
//     $(promoCodeId).val (  promoCode ) ;
//
//     if( marketerName != null ) {
//
//         setMarketerName(marketerNameId, marketerName) ;
//
//     };
// }

// loops through all marketer name options find the matching one and sets it to selected then updates the text.
// function setMarketerName(marketerNameId, marketerName){
//
//     // field for chosen select box
//     var chosenId = marketerNameId.replace("-", "_") + "_chzn";
//
//     $(marketerNameId + ' option').each(function() {
//
//         if ( $(this).text().toLowerCase() == marketerName.toLowerCase() ) {
//
//
//             $(this).attr("selected", true).change();
//
//             $(this).prop("selected", true).change();
//
//             $("#view_186_field_38_chzn" +' a span').text( $(this).text()	);
//
//         }
//
//     });
// }

//**********************************************Event Listeners ***************************************


// // when set preset button is clicked it creates the presets and updates the fields in the form.
// function onSetPresetBtnClick(sourceCodeId, sourceDateId , promoCodeId, marketerNameId){
//     $("#setPresetsBtn").on("click", function(){
//         createCookies() ;
//         setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) ;
//
//     });
// };

// searches for zip code based on the city and state.
// function ```onStateBlur```(zipFieldId, addressFieldId, cityFieldId, stateFieldId){
//
//     var address = '';
//     var city = '';
//     var state = '';
//
//     onBlur( stateFieldId , function( info ) {
//
//         address = $(addressFieldId).val() ;
//
//         city = $(cityFieldId).val() ;
//
//         state = $(stateFieldId).val();
//
//         if( city.length > 2 & state.length > 1 ){
//             getCityStateAddressInfo( address , city , state , function(res){
//                 var zip = getAddressInfo(res, cityFieldId)[0] ;
//
//                 $(zipFieldId).val(zip);
//             }) ;
//         }
//     });
// };


// adds functionality to search city and state data based off zip code
// function onZipCodeBlur( zipFieldId, cityFieldId, stateFieldId, availableCitiesId, getRegion = false) {
//     var selectId = "#view_2-field_24";
//     onBlur( zipFieldId , function( zip ) {
//         //if (getRegion && !$('#field_507').val()) {
//         getRegionByZipCode(zip, (res) => {
//             if (res[0] === 'R' && res.length <= 3) {
//                 $('#field_507').val(res);
//             } else {
//                 $('#field_507').val('');
//                 //if there is no Cities with current ZIP-CODE then showing this message;
//                 if (zip) {
//                     let modalTtitle = 'Area Not Serviced';
//                     modal.infoModal([], modalTtitle, 'Sorry we do not service this Zip code')
//                 }
//             }
//         })
//
//         if(	zip.replace(/ /g,'').length === 5 & $(cityFieldId).val().length < 3	){
//             getZipCodeAddressInfo( zip , function( res ){
//                 var data = getCityAndState( res, cityFieldId );
//                 var cities = data[0] ;
//                 $(stateFieldId).val( data[1] );
//                 $(cityFieldId).val( cities[0] );
//                 setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId );
//             });
//         }
//     });
// }


// function setAvailableCitiesForZipField(cities, cityFieldId, availableCitiesId){
//
//     $(availableCitiesId).children('option').remove();
//
//     $.each(cities, function(index, locality){
//
//         var $option = $(document.createElement('option'));
//
//         $option.html(locality);
//
//         $option.attr('value',locality);
//
//         if(index == 0) {
//
//             $option.attr('selected','selected');
//
//         }
//
//         $(availableCitiesId).append($option);
//
//     });
//
// }


//runs on blur of source code
// function onSourceCodeBlur(sourceCodeId){
//     $(sourceCodeId).on("blur", function(){
//         formatSourceCode(sourceCodeId );
//     });
// }


// unused function

// // when submit button click it format's the form then returns true;
// function onSubmitBtnClick( firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId ){
//     $(".kn-button").on("click", function() {
//         formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId)  ;
//         return true;
//     });
// }

// function fixTld(emailId) {
//     var email = $(emailId).val();
//
//     // splits email after the @ sign
//     var emailEnd = email.slice( email.indexOf("@") );
//
//     var hasTld = emailEnd.indexOf(".") !== -1 ;
//
//     var tld = hasTld ? emailEnd.slice(emailEnd.indexOf(".") + 1 ).toLowerCase() : "" ;
//
//     var isTldValid =  tld === "com" || tld === "net" || tld === "edu" || tld === "org" ;
//
//     // runs if email contains an @ sign and the tld is valid
//
//     if( ! isTldValid && email.indexOf("@") !== -1 ){
//
//         var newTld = emailEnd.includes(".")? "" : ".";
//
//         if (tld[0] === "n") { newTld = newTld + "net";  }
//
//         if (tld[0] === "e") { newTld = newTld + "edu";  }
//
//         if ( tld[0] === "o" ) { newTld = newTld + "org";  };
//
//         if(tld[0] !== "o" || tld[0] !== "e" || tld[0] !== "n" ){ newTld = newTld + "com"; };
//
//         var newEmail = hasTld ? email.substr (0 , email.indexOf(".", email.indexOf("@") ) + 1 ) + newTld : email + newTld ;
//
//         $(emailId).val(newEmail);
//
//     }
//
// }

// function onZipCodeMultiSelectChange(cityId,availableCitiesId ){
//     $(availableCitiesId).on("change",function(){
//         $(cityId).val($(this).val());
//     });
// }

// function isTableEmpty(tableViewId){
//     console.log(tableViewId + " tbody tr");
//     console.log($(tableViewId + " tbody tr"));
//     return $(tableViewId + " tbody tr").hasClass('kn-tr-nodata');
// }
//
// function showAlertOnClickIfTableIsEmpty(buttonClass, tableViewId, message){
//     $(buttonClass).on('click',function(){
//
//         if( isTableEmpty(tableViewId) ){
//             alert(message);
//             return false ;
//         }
//
//     });
// }
//
// function showAlertOnClickIfTableIsNotEmpty(buttonClass, tableViewId, message){
//     $(buttonClass).on('click',function(){
//
//         if( ! isTableEmpty(tableViewId) ){
//             alert(message);
//             return false ;
//         }
//     });
// }

// function hideTableIfEmpty(tableViewId) {
//     if( isTableEmpty(tableViewId) ){
//         $(tableViewId).hide();
//     }
// }


//***************************************** dont copy from here down ********************************************

// data entry with preset view.
specifyView( 'view_186' , function() {

    // variables for all the form fields

    // var firstNameId = "#first" ;
    // var lastNameId = "#last" ;
    // var emailId = "#field_26" ;
    // var phoneId = "#field_189" ;
    // var zipId = "#field_188";
    // var cityId = "#field_186";
    // var availableCitiesId = "#addLead-field_194";
    //
    // var stateId = "#addLead-field_187";
    // var addressId= "#field_185";
    // var sourceCodeId = "#field_190" ;
    // var sourceDateId = "#addLead-field_107" ;
    // var contactDateId = "#addLead-field_151" ;
    // var promoCodeId = "#field_192";
    // var marketerNameId = "#addLead-field_38";
    //
    // setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) ;
    // autocompleteDate(sourceDateId) ;
    // autocompleteDate(contactDateId) ;
    //
    // // event listeners
    // onZipCodeMultiSelectChange(cityId , availableCitiesId )
    // onSetPresetBtnClick(sourceCodeId, sourceDateId , promoCodeId, marketerNameId) ;
    // onStateBlur( zipId, addressId , cityId, stateId ) ;
    // onZipCodeBlur( zipId, cityId, stateId,availableCitiesId ) ;
    // onSourceCodeBlur(sourceCodeId);
    // onSubmitBtnClick( firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId )
});

// function listenToInputFieldValueChange(fieldName) {
//     document.getElementById('field_25').onpaste = function() {
//         setTimeout(() => {
//             initModalForLeadSearch.call(this);
//         }, 0)
//     };
//     $(fieldName).on('keyup', function (e) {
//         if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105) {
//             initModalForLeadSearch.call(this);
//         }
//     });
// }

// function initModalForLeadSearch() {
//     if (this.value && this.value.replace(/[^0-9]/g, "").length === 10) {
//         let value = this.value.replace(/[- )(]/g, '');
//         $.ajax({
//             url: `https://ajt-sandbox.herokuapp.com/inContact/queryhubspot?phone=${value}`,
//             type: "GET",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             success: function (res) {
//                 initUserInfoModal = function (data, modalTitle) {
//                     const customorData = [
//                         {key: 'email', displayName: 'Email', value: ''},
//                         {key: 'firstname', displayName: 'First Name', value: ''},
//                         {key: 'lastname', displayName: 'Last Name', value: ''},
//                         {key: 'addy', displayName: 'City', value: ''},
//                         {key: 'staress', displayName: 'Address', value: ''},
//                         {key: 'citte', displayName: 'State', value: ''},
//                         {key: 'hs_opportunity_status', displayName: 'Opportunity Status', value: ''},
//                         {key: 'appointment_date', displayName: 'Appointment Date', value: '', isDate: true},
//                     ];
//                     customorData.forEach((item, index) => {
//                         if (data[item.key]) {
//                             item.value = item.isDate ? (new Date(+data[item.key].value)).toDateString() : data[item.key].value
//                         } else {
//                             customorData.splice(index, 1)
//                         }
//                     });
//                     modal.infoModal(customorData, modalTitle);
//                 };
//
//                 if (res.length) {
//                     const data = res[0].properties;
//                     data.appointment_date ?
//                         initUserInfoModal(data, getMessage(data, true)) : initUserInfoModal(data, getMessage(data, false));
//                 }
//             },
//             error: function (request, error) {
//                 console.log('Error on checking phone number create', error);
//             }
//         });
//     }
// }

// function getMessage(data, hasAppointment) {
//     return hasAppointment ?
//         `This prospect already has a scheduled appointment for
// 	${(new Date(+data.appointment_date.value)).toDateString()} at ${data.appointment_time.value}.
// 	Please let ${data.firstname.value} know that we look forward to seeing them!
// 	Please do not call this in as a Quickset!`:
//         `This prospect already exists in our system, if they would like to set a Quickset, please call it in now using the phone number they provided.`
// }

specifyView('view_152', function() {
    // var emailId = "#field_26" ;
    // var zipId = "#field_79";
    // var cityId = "#field_75";
    // var stateId = "#view_152-field_76";
    // var availableCitiesId = "#view_152-field_194";
    // let oldInput = document.querySelector('#view_152_field_84_chzn .ui-autocomplete-input');
    //
    // // listenToAutocompleteValueChanges('view_152-field_84', '#view_152_field_84_chzn a span', oldInput);
    // //----------------------------------------------------//
    //
    // $('#kn-input-field_507 label span').remove();
    // $('#field_507').hide();
    // listenToInputFieldValueChange('#field_25');
    // onZipCodeBlur( zipId, cityId, stateId, availableCitiesId, true );
    //
    // initPhoneNumberConfigs(['field_25', 'field_77']);
    // setPhoneNumberMask(['field_25', 'field_77']);
    //
    // //disable HTML input default autosuggestions
    // disableInputDefaultAutosuggest(['first', 'last']);
    //
    // $(emailId).on("blur", function(){
    //     if( $(emailId).val().length > 4 && $(emailId).val().indexOf("@")!== -1) {
    //         fixTld(emailId);
    //     }
    // });
    // // this checks version on qs form
    // checkVersion();
});

specifyView('view_103', function() {
   // var phoneId = "#field_25" ;
   //  var emailId = "#field_26" ;
   //  var zipId = "#field_79";
   //  var cityId = "#field_75";
   //  var stateId = "#view_103-field_76";
   //  var availableCitiesId = "#view_103-field_194";
   //  let oldInput = document.querySelector('#view_103_field_84_chzn .ui-autocomplete-input');
   //  let timer = 0;
   //  var suggestionsListing = [];
   //  var selectBox = [];
   //
   //  // listenToAutocompleteValueChanges('view_103-field_84', '#view_103_field_84_chzn a span', oldInput);
   //  //----------------------------------------------------//
   //
   //  $('#kn-input-field_507 label span').remove();
   //  $('#field_507').hide();
   //  listenToInputFieldValueChange('#field_25');
   //  onZipCodeBlur( zipId, cityId, stateId, availableCitiesId, true );
   //
   //  initPhoneNumberConfigs(['field_25', 'field_77']);
   //  setPhoneNumberMask(['field_25', 'field_77']);
   //
   //  // updates email tld if not proper
   //  $(emailId).on("blur", function() {
   //      if( $(emailId).val().length > 4 && $(emailId).val().indexOf("@")!== -1) {
   //          fixTld(emailId);
   //      }
   //  });
   //
   //  //disable HTML defulat autosuggest for phone fields
   //  disableInputDefaultAutosuggest(['first', 'last']);
   //
   //  // formats email using phone number if email doesn't exist
   //  $(".kn-button").on("click", function() {
   //      formatEmail(emailId, phoneId);
   //      $(phoneId).val( removeCharAndSpaces(	$(phoneId).val()	) ) ;
   //      return true;
   //  });
   //
   //  //Show Customer info on Quicksets create
   //  $(document).on('knack-record-create.view_103', function(event, view, record) {
   //      showCustomerInfoInConfirmationMessage(record, 'view_103')
   //  });
   //
   //  // this makes sure the most recent version is used for lead form
   //  checkVersion();
});

//USA phone number masking (000) 000-0000
// function setPhoneNumberMask(fields = []) {
//     const isNumericInput = (event) => {
//         const key = event.keyCode;
//         return ((key >= 48 && key <= 57) || // Allow number line
//             (key >= 96 && key <= 105) // Allow number pad
//         );
//     };
//
//     const isModifierKey = (event) => {
//         const key = event.keyCode;
//         return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
//             (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
//             (key > 36 && key < 41) || // Allow left, up, right, down
//             (
//                 // Allow Ctrl/Command + A,C,V,X,Z
//                 (event.ctrlKey === true || event.metaKey === true) &&
//                 (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
//             )
//     };
//
//     const enforceFormat = (event) => {
//         // Input must be of a valid number format or a modifier key, and not longer than ten digits
//         if(!isNumericInput(event) && !isModifierKey(event)){
//             event.preventDefault();
//         }
//     };
//
//     const formatToPhone = (event) => {
//         if(isModifierKey(event)) {return;}
//         let position = event.target.selectionStart;
//
//         // I am lazy and don't like to type things more than once
//         const target = event.target;
//         const input = target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
//         const zip = input.substring(0,3);
//         const middle = input.substring(3,6);
//         const last = input.substring(6,10);
//         const fixedPositions = [2,3,4];
//
//         if (fixedPositions.includes(position)) {return false}
//
//         if(input.length > 6) {target.value = `(${zip}) ${middle}-${last}`;}
//         else if(input.length > 3) {target.value = `(${zip}) ${middle}`;}
//         else if(input.length > 0){target.value = `(${zip}`;}
//     };
//
//     fields.forEach(field => {
//         const inputElement = document.getElementById(field);
//         inputElement.addEventListener('keydown',enforceFormat);
//         inputElement.addEventListener('keyup',formatToPhone);
//     })
// }
//-----------------------------------------------------------------------

// ********************************** code for expenses feature *******************//

// putting her cause only used in add expense form but could be used globally.
// function getNum(fieldID){
//     var newNum = $(fieldID).val().replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
//     return +newNum ;
// }

// // hides the employee field and uses it to check if the employee whos report it is has a higher mileage rate
// function getMileageRateUsingForm() {
//     $("#kn-input-field_219").hide();
//
//     var isPersonWithHigherRate =  $("#kn-input-field_219").text().toLowerCase().includes('salgado') ;
//
//     return isPersonWithHigherRate ? .45 : .35 ;
//
// };
//
// function getMileageRateByUser(){
//     return Knack.getUserAttributes() != undefined ? Knack.getUserAttributes().values.field_247 : .35 ;
// }
//
// // calculates total cost of mileage and tolls ;
// function calculateTravelExpense( user ) {
//     var beginningMileageId = "#field_225" ;
//     var endingMileageId = "#field_226";
//     var amountId= "#field_222";
//     var tollsId = "#field_252"
//     var expSourceCodeId = "#field_250";
//     var dailyMileageDeduct = "#field_267";
//     var maxExpense = 1000;
//     var mileageDeduct = 40;
//     var tolls = getNum(tollsId);
//     var mileageRate = user ?  getMileageRateByUser() :  getMileageRateUsingForm() ;
//     var deduct = $(dailyMileageDeduct).val() == "No"? 0 : mileageRate * mileageDeduct ;
//     var totalMiles = getNum(endingMileageId) - getNum(beginningMileageId) ;
//     var total = totalMiles > 40 ? +(totalMiles * mileageRate) - deduct + tolls : tolls;
//
//     console.log("test " + mileageRate);
//
//     total = total < 0 ? 0 : total ;
//
//     total = total > maxExpense ? 0 : total ;
//
//     if ( tolls > 0 || $(endingMileageId).val().length > 0) {
//         $(amountId).val(total.toFixed(2) );
//         $(amountId).prop('disabled', true);
//     }else{
//         $(amountId).prop('disabled', false);
//     }
//
// }

// // for all add expense form views use this code, there is a temp band aid in there.
// function setupAddExpenseForm(isCalculatedByLoggedInUser) {
//     var categoryId = "#kn-input-field_238 .select";
//     var categoryIdChzn = "#connection-picker-chosen-field_238 .chzn-container";
//     var beginningMileageId = "#field_225" ;
//     var endingMileageId = "#field_226";
//     var amountId= "#field_222";
//     var tollsId = "#field_252" ;
//     var expSourceCodeId = "#field_250";
//     var receiptId= "#field_227_upload";
//
//     // hide employee field if mileagerate is false meaning its not user
//     if(! isCalculatedByLoggedInUser){
//         calculateTravelExpense(isCalculatedByLoggedInUser)
//     };
//
//     $(beginningMileageId).on("blur", function(){
//         calculateTravelExpense(isCalculatedByLoggedInUser)
//     });
//
//     $(endingMileageId).on("blur", function(){
//         calculateTravelExpense(isCalculatedByLoggedInUser)
//     });
//
//     $(tollsId).on('blur',function(){
//         calculateTravelExpense(isCalculatedByLoggedInUser);
//     });
//
//     // this is in case anyone puts a symbol other then a period in the amount field it removes it.
//     $(amountId).on("blur",function(){
//         $(this).val( $(this).val().replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '') );
//     });
//
//     // When expense category gets changed all input fields get cleared
//     $(categoryId).on("change", function(){
//         $(amountId).val(" ");
//         $(beginningMileageId).val(0);
//         $(endingMileageId).val(0);
//         $(tollsId).val(0);
//         $(amountId).prop('disabled', false);
//     });
//
//     // shows alert on submit if receipt is needed
//     $(".kn-form .kn-button").on('click',function(){
//
//         var hasReceipt = $('#kn-input-field_227 .kn-asset-current').text().trim(" ").length != 0 ;
//
//         var isTravelExpense = $(categoryIdChzn + " a span").text().toLowerCase() == "travel" ;
//         var tolls = getNum(tollsId);
//
//         if ( isTravelExpense ){
//             calculateTravelExpense(isCalculatedByLoggedInUser)
//         }
//
//         if (tolls > 0 &  isTravelExpense & ! hasReceipt ){
//             alert('Please add a receipt for your toll');
//             return false ;
//         }
//
//         if ( ! isTravelExpense & ! hasReceipt ){
//             alert("Please make sure you have selected the expense category and added a receipt if its a non mileage expenses");
//             return false ;
//         }
//
//     });
// }

//manager edit expense for employee view
specifyView('view_399',function(){
    setupAddExpenseForm( false );
});

//manager add expense for employee view
specifyView('view_528',function(){
    setupAddExpenseForm( false );
});

// data entry add expense form
specifyView('view_300',function(){
    setupAddExpenseForm( false );
});

// employee submit expense report view
specifyView('view_368',function(){
    showAlertOnClickIfTableIsEmpty('.view_368 a', '.view_372', "Please add expenses to this report prior to moving onto the next step");
});

// employee expenses dashboard - view 285 is for the menu and 281 is for the table
specifyView('view_285',function(){
    showAlertOnClickIfTableIsNotEmpty('.view_285 .kn-link-1', ".view_316", "Please add your expenses and submit your last report before creating a new one");
});

// employee expenses dashboard - view 316 is the unsubmitted reports table.
specifyView('view_316', function(){
    hideTableIfEmpty(".view_316")
});

// employee add report page - form view
specifyView('view_317', function(){
    showAlertOnClickIfTableIsNotEmpty('.view_317 .kn-button', ".view_322", "Please scroll down to add your expenses and submit your last report before creating a new one");
});

// employee add report page - 322 is table view view
specifyView('view_322', function(){
    hideTableIfEmpty(".view_322")
});

// employee add expense form - view 319 is for the add expense form
specifyView('view_389', function(){
    setupAddExpenseForm( true );
});

// employee submit report view - view 321 is for the submit button and 318 is for the table of expenses.
specifyView('view_321',function(){
    showAlertOnClickIfTableIsEmpty('.view_321 .kn-button', ".view_318", "Please add expenses to this report prior to submitting it");
});

// employee edit expense view for first edit expense page
specifyView('view_392', function(){
    setupAddExpenseForm(true);
});

// employee edit expense view for second edit expense page
specifyView('view_395', function(){
    setupAddExpenseForm(true);
});

// employee edit expense view for the re submit page
specifyView('view_449', function(){
    setupAddExpenseForm(true);
});

// employee edit expense view for second edit expense page
specifyView('view_399', function(){
    setupAddExpenseForm(true);
});

// employee edit expense view for second edit expense page
specifyView('view_390', function(){
    showAlertOnClickIfTableIsEmpty('.view_390 .kn-button', ".view_394", "Please add expenses to this report prior to submitting it");
});

// //Advocate submit lead view
// specifyView('view_414',function() {
//     initPhoneNumberConfigs(['field_25']);
//     setPhoneNumberMask(['field_25']);
// });

//Add Referral lead  view
specifyView('view_421',function(){
    initPhoneNumberConfigs('field_25');
    setPhoneNumberMask(['field_25']);
});

specifyView('view_415',function(){
    let a = document.querySelector('.register a');
    a.classList.add('sign-up-custom-class');
});

//add dashes
// function setPhoneNumberFormat(input) {
//     var x = input.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
//     input.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
// }

// function initPhoneNumberConfigs(fields = []) {
//     fields.forEach(field => {
//         let phoneNumber = document.getElementById(field);
//         phoneNumber.setAttribute('maxlength', 14);
//         phoneNumber.setAttribute('type', 'tel');
//         phoneNumber.setAttribute('pattern', '^\d{3}-\d{3}-\d{4}$');
//     })
// }

// function sendCreateContactRequest(data){
//     $.ajax({
//         type: 'POST',
//         url: 'https://ajt-sandbox.herokuapp.com/knack',
//         headers: {"content-type": "application/json"},
//         data: data,
//         success: function(){
//             console.log('hello')
//         },
//         failure: function(error){
//             console.log(error);
//         }
//     });
// }

//Adding user credentials on Leads/Quicksets submit
// function showCustomerInfoInConfirmationMessage(record, view) {
//     setTimeout(() => {
//         let name = document.createElement("p");
//         name.innerHTML = 'Name: ' + record.field_1_raw.first + ' ' + record.field_1_raw.last;
//
//         let phoneNumber = document.createElement("p");
//         phoneNumber.innerHTML = 'Phone Number: ' + record.field_25_raw.formatted;
//
//         let email = document.createElement('p');
//         email.innerHTML = 'Email: ' + record.field_26_raw.email;
//
//         let address = document.createElement('p');
//         address.innerHTML = 'Adress: ' + record.field_73_raw;
//
//         let city = document.createElement('p');
//         city.innerHTML = 'City: ' + record.field_75_raw;
//
//         let state = document.createElement('p');
//         state.innerHTML = 'State: ' + record.field_76_raw;
//
//         $('#' + view +' .kn-form-confirmation .success').append(name, phoneNumber, email, address, city, state);
//     })
// }

// function createContact(record, view){
//     //var data = formatRecord(record) ;
//     if (view) {
//         showCustomerInfoInConfirmationMessage(record, view)
//     }
//     sendCreateContactRequest(JSON.stringify(record)) ;
// }

//advocate form submission.
$(document).on('knack-form-submit.view_414', function(event, view, record) {
    createContact(record);
});
// lead submit form
// $(document).on('knack-form-submit.view_152', function(event, view, record) {  createContact(record, "T" )});

// // updates the user to the most recent version of the app by reloading the page and updating their user record.
// function updateUserVersion(userId, updatedVersion){
//
//     var d = {
//         "field_362": updatedVersion
//     }
//     $.ajax({
//         url:"https://api.knack.com/v1/objects/object_4/records/" + userId,
//         type:"PUT",
//         headers: {
//             "X-Knack-Application-Id": "5ae163cf99f0812865bce773",
//             "X-Knack-REST-API-KEY":"71e543b0-a1af-11e9-b051-1fb54b980f24",
//             'Content-Type': 'application/json'
//         },
//         data: JSON.stringify(d),
//         success: function(data){
//             location.reload(true);
//         },
//         error: function(request,error){
//             console.log(error);
//         }
//     });
// }
//
// // checks the users version of the app then updates it if its not the most recent
// function checkVersion(){
//     $.ajax({
//         url:"https://api.knack.com/v1/objects/object_31/records",
//         type:"GET",
//         headers: {
//             "X-Knack-Application-Id": "5ae163cf99f0812865bce773",
//             "X-Knack-REST-API-KEY":"71e543b0-a1af-11e9-b051-1fb54b980f24",
//             'Content-Type': 'application/json'
//         },
//         success: function(data){
//
//             if(Knack.getUserAttributes().values.field_362 != data.total_records){
//
//                 updateUserVersion( Knack.getUserAttributes().id, data.total_records ) ;
//
//             }else{
//                 console.log('isflase');
//             }
//         },
//         error: function(request,error){
//             console.log(error);
//         }
//     });
//
// }

// this checks version on marketer dashboard.
specifyView("view_127",function(){
    checkVersion();
});

// salesperson api request
$(document).on('knack-form-submit.view_421', function(event, view, record) {
    createContact(record);
});

//lead form api request
$(document).on('knack-form-submit.view_152', function(event, view, record) {  createContact(record, 'view_152') });


//data entry + preset form api requests
$(document).on('knack-form-submit.addLead', function(event, view, record) {  createContact(record) });

// //modal view int.
// var modal = (function () {
//     let jsUcfirst = function(string) {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     };
//
//     let initModal = function (modalTitle = 'Title') {
//         $('#modal-cm').remove();
//         let modal = document.createElement('div');
//         modal.setAttribute('id', 'modal-cm');
//         modal.classList.add('modal-cm');
//         let modalContainer = document.createElement('div');
//         modalContainer.classList.add('modal-container-cm');
//         let modalHeader = document.createElement('div');
//         modalHeader.classList.add('modal-header-cm');
//         modalHeader.innerText = modalTitle || 'Title';
//         let modalContent = document.createElement('div');
//         modalContent.classList.add('modal-content-cm');
//         let closeIcon = document.createElement('span');
//         closeIcon.classList.add('close-cm');
//
//         modalContainer.appendChild(closeIcon);
//         modalContainer.appendChild(modalHeader);
//         modalContainer.appendChild(modalContent);
//         modal.appendChild(modalContainer);
//         document.body.classList.add('overflow-hidden');
//         document.body.appendChild(modal);
//
//         closeModal = () => {
//             modal.parentElement.removeChild(modal);
//             document.body.classList.remove('overflow-hidden');
//         };
//
//         closeIcon.onclick = () => closeModal();
//
//         window.onclick = function(event) {
//             if (event.target === modal) {
//                 document.body.classList.remove('overflow-hidden');
//                 modal.parentElement.removeChild(modal);
//             }
//         };
//     };
//
//     let formModal = function (items, fieldType, modalTitle, patchValueTo) {
//         initModal(modalTitle);
//         items.forEach(function(item, index) {
//             let label = document.createElement( 'label');
//             label.classList.add('radio-label');
//
//             let input = document.createElement("input");
//             input.setAttribute('type',"radio");
//             input.setAttribute('name', 'radio');
//
//             //Marks the first item in modal as selected & checked
//             index || input.setAttribute('checked', 'checked');
//
//             let span = document.createElement('span');
//             span.classList.add('checkmark');
//
//             label.innerText = item;
//             label.appendChild(input);
//             label.appendChild(span);
//
//             label.onclick = function(event) {
//                 setTimeout(() => {
//                     $(patchValueTo).val(item);
//                     document.body.classList.remove('overflow-hidden');
//                     $( "#modal-cm" ).remove();
//                 }, 300)
//             };
//
//             $('#modal-cm .modal-content-cm').append( label );
//         })
//     };
//
//     let infoModal = function (items, modalTitle, message){
//         initModal(modalTitle);
//         //in the case if we just whanat to show a simple message without key => value
//         if (message && !items.length) {
//             let div = document.createElement('div');
//             div.classList.add('info-row');
//
//             let info = document.createElement('span');
//             info.innerText = message;
//             div.appendChild(info);
//             $('#modal-cm .modal-content-cm').append(div);
//             return;
//         }
//
//         items.forEach(item => {
//             let div = document.createElement('div');
//             div.classList.add('info-row');
//
//             let title = document.createElement('span');
//             let info = document.createElement('span');
//             title.innerText = jsUcfirst(item.displayName) + ': ';
//             info.innerText = item.value;
//
//             div.appendChild(title);
//             div.appendChild(info);
//
//             $('#modal-cm .modal-content-cm').append(div);
//         })
//     };
//
//     return {
//         formModal: formModal,
//         infoModal: infoModal
//     }
// })();

// //utils
// function disableInputDefaultAutoSuggest(fields = []) {
//     fields.forEach(field => {
//         let el = document.getElementById(field);
//         el.setAttribute('autocomplete', 'off');
//     })
// }
