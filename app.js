window.$ = $;
window.Knack = Knack;
window.knackApiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': Knack.getUserToken(),
    "X-Knack-Application-Id": Knack.application_id,
    "X-Knack-REST-API-KEY": "d8428e10-a7f4-11e9-808f-0727a4c9d6da"
};

const scripts = [
    'https://knack.test/modals.js',
    'https://knack.test/utils.js',
    'https://knack.test/map.js',
    'http://knack.test/cookies.js',
    'http://knack.test/mask.js',
    'https://knack.test/referral.js',
    'http://knack.test/leads-helper.js',
    'https://knack.test/leads.js',
    'https://knack.test/add-lead.js',
    'https://knack.test/expense.js',
];

// The first parameter is an array of files to load.
// The second parameter is a function to execute after all the libraries have completed loading.
LazyLoad.js(scripts, function () {
    /*
    * Referrals page
    * view-414
    * */
    utils.specifyView('view_414', function () {
        referral.init(utils, modal, map, mask);

        $(document).on('knack-form-submit.view_414', function(event, view, record) {
            referral.createContact(record);
        });
    });

    /*
    * Add Lead Page
    * addLead
    * */
    utils.specifyView('view_186', function () {
        addLead.init(utils, modal, map, cookies, mask, leadsHelper);

        //data entry + preset form api requests
        $(document).on('knack-form-submit.addLead', function(event, view, record) {  referral.createContact(record) });
    });

    /*
    * Leads Page
    * view_152
    * */
    utils.specifyView('view_152', function () {
        leads.lead.init(utils, modal, map, mask, leadsHelper);

        //lead form api request
        $(document).on('knack-form-submit.view_152', function(event, view, record) {  referral.createContact(record, 'view_152') });
    });

    /*
    * QuickSets Page
    * view_103
    * */
    utils.specifyView('view_103', function () {
        leads.quickSet.init(utils, modal, map, mask, leadsHelper)
    });

    /*
    * Expense Page
    * view_399
    * manager edit expense for employee view
    * */
    utils.specifyView('view_399',function(){
        expense.init(utils, modal, map, mask,  false );
    });

    /*
    * Employee Page
    * view_528
    * Manager add expense for employee view
    * */
    utils.specifyView('view_528',function(){
        expense.init(utils, modal, map, mask,  false );
    });

    /*
    * Expense Page
    * view_300
    * data entry add expense form
    * */
    utils.specifyView('view_300',function(){
        expense.init(utils, modal, map, mask,  false );
    });

    /*
    * Employee Page
    * view_368
    * Employee submit expense report view
    * */
    utils.specifyView('view_368',function(){
        utils.showAlertOnClickIfTableIsEmpty('.view_368 a', '.view_372', "Please add expenses to this report prior to moving onto the next step");
    });

    /*
    * Employee Page
    * view_285
    * employee expenses dashboard - view 285 is for the menu and 281 is for the table
    * */
    utils.specifyView('view_285',function(){
        utils.showAlertOnClickIfTableIsNotEmpty('.view_285 .kn-link-1', ".view_316", "Please add your expenses and submit your last report before creating a new one");
    });

    /*
    * Employee Page
    * view_316
    * Employee expenses dashboard - view 316 is the un submitted reports table.
    * */
    utils.specifyView('view_316', function(){
        utils.hideTableIfEmpty(".view_316")
    });

    /*
    * Employee Page
    * view_317
    * Employee add report page - form view
    * */
    utils.specifyView('view_317', function(){
        utils.showAlertOnClickIfTableIsNotEmpty('.view_317 .kn-button', ".view_322", "Please scroll down to add your expenses and submit your last report before creating a new one");
    });

    /*
    * Employee Page
    * view_322
    * Employee add report page - 322 is table view view
    * */
    utils.specifyView('view_322', function(){
        utils.hideTableIfEmpty(".view_322")
    });

    /*
    * Employee Page
    * view_389
    * Employee add expense form - view 319 is for the add expense form
    * */
    utils.specifyView('view_389', function(){
        expense.init(utils, modal, map, mask,   true );
    });

    /*
    * Employee Page
    * view_321
    * Employee submit report view - view 321 is for the submit button and 318 is for the table of expenses.
    * */
    utils.specifyView('view_321',function(){
        utils.showAlertOnClickIfTableIsEmpty('.view_321 .kn-button', ".view_318", "Please add expenses to this report prior to submitting it");
    });

    /*
    * Expenses Page
    * view_392
    * Employee edit expense view for first edit expense page
    * */
    utils.specifyView('view_392', function(){
        expense.init(utils, modal, map, mask, true);
    });

    /*
    * Expenses Page (Edit)
    * view_395
    * Employee edit expense view for second edit expense page
    * */
    utils.specifyView('view_395', function(){
        expense.init(utils, modal, map, mask, true);
    });

    /*
    * Expanses Page (Edit)
    * view_449
    * Employee edit expense view for the re submit page
    * */
    utils.specifyView('view_449', function(){
        expense.init(utils, modal, map, mask, true);
    });

    /*
    * Employee edit expense
    * view_399
    * Employee edit expense view for second edit expense page
    * */
    utils.specifyView('view_399', function(){
        expense.init(utils, modal, map, mask, true);
    });

    /*
    * Employee edit expense
    * view_390
    * Employee edit expense view for second edit expense page
    * */
    utils.specifyView('view_390', function(){
        utils.showAlertOnClickIfTableIsEmpty('.view_390 .kn-button', ".view_394", "Please add expenses to this report prior to submitting it");
    });

    /*
    * Add Referral Page
    * view_421
    * Add Referral lead  view
    * */
    utils.specifyView('view_421',function(){
        mask.initPhoneNumberConfigs('field_25');
        mask.setPhoneNumberMask(['field_25']);

        // salesperson api request
        $(document).on('knack-form-submit.view_421', function(event, view, record) {
            referral.createContact(record);
        });
    });

    /*
    * SignUp Page
    * view_415
    * adding custom styles to submit button
    * */
    utils.specifyView('view_415',function(){
        let a = document.querySelector('.register a');
        a.classList.add('sign-up-custom-class');
    });

    /*
    * Marketer Dashboard Page
    * view_127
    * this checks version on marketer dashboard.
    * */
    utils.specifyView("view_127",function(){
        utils.checkVersion();
    });
});