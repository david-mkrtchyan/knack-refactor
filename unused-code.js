//Gets all leads in date range from knack database then calls update knack id function to update there knack id
// var leadesPage = 1;
// var rowsPerPage = 25;

//value":"06/07/2019"
//this functions returns Leads paginated, and after that,
// sends API request to Knack API to update leadId field in Leads table
// function getLeadsListing() {
//     let filters = {
//         rules: [
//             //{
//             //  "field":"field_344",
//             //  "operator":"is",
//             //   "value":"06/01/2019"
//             //  },
//             {
//                 "match":"and",
//                 "field":"field_565",
//                 "operator":"is blank",
//                 "field_name":"Knack Id"
//             },
//             {
//                 "field":"field_344",
//                 "operator":"is after",
//                 "value":"05/30/2019"
//             },
//             {
//                 "field":"field_344",
//                 "operator":"is before",
//                 "value":"07/01/2019"
//             }
//         ]
//     }
//
//     let api_url = `https://api.knack.com/v1/objects/object_1/records?page=${leadesPage++}&rows_per_page=${rowsPerPage}&filters=` + encodeURIComponent(JSON.stringify(filters));
//
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
//             let items = res.records;
//             let index = 0;
//
//             var doAsyncThing = function (recordId) {
//                 return updateKnackid(recordId)
//             };
//
//             var recursivelyDoAsyncThing = function (recordId) {
//                 console.log('current index', index)
//                 return doAsyncThing(recordId).then(function (response) {
//                     return new Promise(function (resolve, reject) {
//                         index++;
//                         //do something with response
//                         if (index < items.length) {
//                             //get newlastId
//                             return resolve(recursivelyDoAsyncThing(items[index].id));
//                         } else {
//                             resolve();
//                         }
//                     });
//                 });
//             };
//
//             recursivelyDoAsyncThing(items[index].id).then(function () {
//                 console.log('Done! all records updated successfully');
//                 if (leadesPage <= res.total_pages) {
//                     getLeadsListing();
//                 }
//             });
//
//         },
//         error: function (request, error) {
//             console.log(error)
//         }
//     });
// }
//-----------------------------------------------------------------------------

// function updateKnackid(knackId) {
//     return new Promise(function (resolve, reject) {
//         $.ajax({
//             url: `https://api.knack.com/v1/objects/object_1/records/${knackId}`,
//             dataType: 'json',
//             type: "PUT",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': Knack.getUserToken(),
//                 "X-Knack-Application-Id": Knack.application_id,
//                 "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
//             },
//             data: JSON.stringify({"field_565": knackId}),
//             success: function (res) {
//                 resolve(res)
//             },
//             error: function (request, error) {
//                 resolve(updateKnackid(knackId))
//                 //reject(error)
//             }
//         });
//     });
// }
//---------------------------------------------------------------------------------

// // this makes sure the most recent version is used for lead form
// specifyView("view_152",function(){
//     checkVersion();
// });
//
// // this checks version on qs form
// specifyView("view_103",function(){
//     checkVersion();
// });
//--------------------------------------------------------------------

// runs on blur of source preset blur
// function onSourceCodePresetBlur(sourceCodeId){
//     $(sourceCodeId).on("blur", function(){
//         formatSourceCode(sourceCodeId );
//
//     });
// }
//-------------------------------------------------


//Leads QuickSSets page source code suggestions listing functionality
//adding input field to source autocomplete and listening value changes
// function listenToAutocompleteValueChanges(viewFiledId, selectedElementContainer, oldInput) {
//     //input parent element container
//     let parentEl = oldInput.parentElement;
//     let timer = 0;
//     let filters = [
//         {
//             field: "field_82",
//             operator: "contains",
//             rows_per_page: 1000,
//             value: "",
//         }
//     ];
//     let api_url = 'https://api.knack.com/v1/objects/object_1/records';
//     let suggestedItems = [];
//
//     $('#connection-picker-chosen-field_84').on('click', function () {
//         setSuggestionsListing(suggestedItems);
//         parentEl.querySelector('input').focus();
//     });
//
//     //custom input for autosugest sorce code
//     let input = document.createElement('input');
//     input.setAttribute('type', 'text');
//     input.setAttribute('placeholder', 'Type to search...');
//     input.setAttribute('autocomplete', 'off');
//     input.classList.add('ui-autocomplete-input');
//
//     parentEl.replaceChild(input, oldInput);
//
//     input.onkeydown = function (event) {
//         input.oninput = function () {
//             clearTimeout(timer);
//             if (event.keyCode !== 8) {
//                 addDashForSource(input);
//             }
//             api_url = 'https://api.knack.com/v1/objects/object_9/records';
//             timer = setTimeout(() => {
//                 filters[0] = Object.assign(filters[0], {value: this.value});
//                 api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
//                 $.ajax({
//                     url: api_url,
//                     dataType: 'json',
//                     type: "GET",
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': Knack.getUserToken(),
//                         "X-Knack-Application-Id": Knack.application_id,
//                         "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
//                     },
//                     success: function (res) {
//                         suggestedItems = res.records;
//                         setSuggestionsListing(suggestedItems, viewFiledId, selectedElementContainer)
//                     },
//                 });
//             }, 300)
//         };
//     };
//     $(parentEl).prepend(input);
// }
//
// //addig suggestion items for Sorce listing
// function setSuggestionsListing(items, viewFiledId, selectedElementContainer) {
//     let container = document.getElementsByClassName('chzn-results')[0];
//     let selectBox = document.getElementById(''+viewFiledId);
//     let selectedItemBox = document.querySelector(''+selectedElementContainer);
//     $(container).empty();
//     $(selectBox).empty();
//
//     items.forEach((item, index) => {
//         let li = document.createElement('li');
//         li.setAttribute('id', viewFiledId + '_chzn_o_' + (index + 1));
//         li.classList.add('active-result');
//         li.innerText = item.field_93;
//
//         let option = document.createElement('option');
//         option.setAttribute('value', item.id);
//         option.innerText = item.field_93;
//
//         li.onclick = function (event) {
//             event.preventDefault()
//
//             selectedItemBox.innerText = this.innerText;
//             this.classList.add('result-selected');
//
//             let selectedOption = Array.from(selectBox.children).find(item => item.getAttribute('value') === item.id);
//         };
//
//         $(container).append(li);
//         $(selectBox).append(option)
//     })
// }
//------------------------------------------------------------------------------


//formats the record before creating Contact
// function formatRecord(record, isMarketerEntered){
//
//     var obj = {
//         "knack_id": record.id,
//         "address": record.field_73_raw,
//         "address2": record.field_74_raw,
//         "city":  record.field_75_raw,
//         "state": record.field_76,
//         "zip": record.field_79,
//         "phone": record.field_25_raw.formatted,
//         "email": record.field_26_raw.email,
//         "call_on_date": record.field_151,
//         "dialer_status": record.field_175,
//         "hot_lead": record.field_137,
//         "hs_opportunity_status":"L",
//         "intcabs":record.field_144,
//         "intctops":record.field_146,
//         "intref":record.field_145,
//         "marketer_entered_lead": isMarketerEntered,
//         "spouse_s_name": record.field_143,
//         "srcname":record.field_95,
//         "source": record.field_94,
//         "message":record.field_55,
//         "promo":record.field_108,
//
//         "lifecyclestage":"marketingqualifiedlead"
//     };
//
//     if (record.field_107 == undefined || record.field_107.length < 3 ){
//         var date=new Date();
//         var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
//         console.log("date val" + val);
//         obj.srcdate = val ;
//     }else{
//         console.log('no date val') ;
//         obj.srcdate = record.field_107  ;
//     }
//
//     if (record.field_1_raw != undefined){
//         obj.firstname = record.field_1_raw.first ;
//         obj.lastname = record.field_1_raw.last ;
//     }
//
//     if( record.field_77_raw != undefined){
//         obj.mobilephone = record.field_77_raw.formatted ;
//     }
//
//     if ( record.field_25_raw != undefined){
//         obj.phone = record.field_25_raw.formatted;
//     }
//
//     if( record.field_26_raw != undefined  ){
//         obj.email = record.field_26_raw.email.length > 2 ? record.field_26_raw.email : "+1" + removeCharAndSpaces(	record.field_25_raw.formatted	) + "@hubspot.com" ;
//     }
//
//     if (record.field_38_raw != undefined){
//         obj.mktrepname = record.field_141 ;
//     }
//
//     if (record.field_107 == undefined || record.field_107.length < 3 ){
//         var date = new Date();
//         var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
//         obj.srcdate = val ;
//     }else{
//         obj.srcdate = record.field_107  ;
//     }
//
//     return JSON.stringify( obj) ;
//
// }
//---------------------------------------------------------------------------------------

// sets the value of the city and state form fields
// function setCityAndState( cityStateData , cityFieldId, stateFieldId ){
//     var city = cityStateData [0] ;
//     var state = cityStateData  [1] ;
//     $(cityFieldId).val( city );
//     $(stateFieldId).val( state );
// }
//----------------------------------------------------------------------------

//Sending request to Node server for merketers list NEW ADDED TABLE
// specifyView('view_562', function () {
//     payrollDateRangeFilter = JSON.stringify({from: payrollStartDate, to: currentDate});
//     getInputFilterValue(); //adds filters for Payroll period
//     getPayrolls();
// });
//-----------------------------------------------------------------

// Manager approve report view -- deprecated because managers no longer have to export reports
// specifyScene('scene_224', function(){
//     $("#kn-scene_224 .kn-table-wrapper").hide();
//     $("#kn-scene_224 .kn-entries-summary").hide();
// });
//--------------------------------------------------------------------------------

// manager update expense report status view -- deprecated i believe
// specifyView('view_257', function() {
//     // on click for the update report button in managers view
//     $("#view_257 .kn-button").on("click",function(){
//         var status = $('#view_257-field_211').val().toLowerCase();
//         // if status is approved or denied it doesn't allow form submit
//         if( ! (status == 'approved' || status == 'denied')){
//             alert('please set status to approved or denied in order to update');
//             return false ;
//         }
//     });
// });
//-------------------------------------------------------------------

//-----------------------------------
//$.ajax({
//  type: "POST",
//  url: "https://km-hub-contact.herokuapp.com/knack",
//  data:JSON.stringify( {
// 	"knack_id":"5c61c0f0468c2c28a42d88b4",
//    "firstname":"first",
//    "lastname":"last",
//    "address":"test",
//    "address2":"test",
//    "city":"test",
//    "state":"test",
//    "zip":"test",
//    "phone":"(111) 111-1111",
//    "mktrepname":"test",
//    "email":"test",
//    "call_on_date":"test",
//    "dialer_status":"test",
//    "hot_lead":"test",
//    "hs_opportunity_status":"test",
//    "intcabs":"test",
//    "intctops":"test",
//    "intref":"test",
//    "marketer_entered_lead":"test",
//     "spouse_s_name":"spouse_s_name",
//     "srcdate":"srcdate",
//     "srcname":"srcname",
//     "message":"test"
//  }),
//  success: function(){
//  	console.log('hello');
//  },
//  dataType: "json"
//
//});
//---------------------------------------------------------------