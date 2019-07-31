const addLead = (function () {
    var firstNameId = "#first" ;
    var lastNameId = "#last" ;
    var emailId = "#field_26" ;
    var phoneId = "#field_189" ;
    var zipId = "#field_188";
    var cityId = "#field_186";
    var availableCitiesId = "#addLead-field_194";

    var stateId = "#addLead-field_187";
    var addressId= "#field_185";
    var sourceCodeId = "#field_190" ;
    var sourceDateId = "#addLead-field_107" ;
    var contactDateId = "#addLead-field_151" ;
    var promoCodeId = "#field_192";
    var marketerNameId = "#addLead-field_38";

    function autocompleteDate(dateFieldId) {
        var dateInfo = new Date() ;
        var month = dateInfo.getMonth() ;
        var year= dateInfo.getFullYear();

        $(dateFieldId).keyup(function(){
            if ($(this).val().length == 2){
                $(this).val($(this).val() + "/");
            }else if ($(this).val().length == 5  ){
                $(this).val($(this).val() + "/" + year);
            }
        });
    }

    // when set preset button is clicked it creates the presets and updates the fields in the form.
    function onSetPresetBtnClick(sourceCodeId, sourceDateId , promoCodeId, marketerNameId){
        $("#setPresetsBtn").on("click", function(){
            createCookies() ;
            setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) ;

        });
    }

    //  sets the all preset fields and form fields with the cookie for the preset.
    function setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) {
        var sourceCode = $.cookie("sourceCodePreset");
        var sourceDate = $.cookie("sourceDatePreset") ;
        var promoCode = $.cookie("promoCodePreset");
        var marketerName = $.cookie("marketerNamePreset" );

        //sets preset fields
        $("#sourceCodePreset").val ( sourceCode );
        $("#sourceDatePreset").val( sourceDate ) ;
        $("#promoCodePreset").val( promoCode ) ;
        $("#marketerNamePreset").val( marketerName ) ;

        // sets form fields
        $(sourceCodeId).val (  sourceCode ) ;
        $(sourceDateId).val (  sourceDate ) ;
        $(promoCodeId).val (  promoCode ) ;
        if( marketerName != null ) {
            setMarketerName(marketerNameId, marketerName) ;
        }
    }

    // loops through all marketer name options find the matching one and sets it to selected then updates the text.

    function setMarketerName(marketerNameId, marketerName){
        // field for chosen select box
        var chosenId = marketerNameId.replace("-", "_") + "_chzn";
        $(marketerNameId + ' option').each(function() {
            if ( $(this).text().toLowerCase() == marketerName.toLowerCase() ) {

                $(this).attr("selected", true).change();
                $(this).prop("selected", true).change();
                $("#view_186_field_38_chzn" +' a span').text( $(this).text()	);
            }
        });
    }
// searches for zip code based on the city and state.
    function onStateBlur(zipFieldId, addressFieldId, cityFieldId, stateFieldId, utils, map){
        var address = '';
        var city = '';
        var state = '';

        utils.onBlur( stateFieldId , function( info ) {
            address = $(addressFieldId).val() ;
            city = $(cityFieldId).val() ;
            state = $(stateFieldId).val();
            if( city.length > 2 & state.length > 1 ){
                map.getCityStateAddressInfo( address , city , state , function(res){
                    var zip = getAddressInfo(res, cityFieldId)[0] ;

                    $(zipFieldId).val(zip);
                }) ;
            }
        });
    }

    function onZipCodeMultiSelectChange(cityId,availableCitiesId ){
        $(availableCitiesId).on("change",function(){
            $(cityId).val($(this).val());
        });
    }

    //runs on blur of source code
    function onSourceCodeBlur(sourceCodeId){
        $(sourceCodeId).on("blur", function(){
            formatSourceCode(sourceCodeId );
        });
    }

    // when submit button click it format's the form then returns true;
    function onSubmitBtnClick( firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId ){
        $(".kn-button").on("click", function() {
            formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId)  ;
            return true;
        });
    }

    // formats the form
    function formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId){
        // adds phone to email if email doesn't exist
        formatEmail(emailId, phoneId);
        $(phoneId).val( removeCharAndSpaces(	$(phoneId).val()	) ) ;

        // capitilize name first letters
        $(firstNameId).val( capitalizeFirstLetter ( $(firstNameId).val() ) );
        $(lastNameId).val( capitalizeFirstLetter ( $(lastNameId).val() ) );

        //sets state and source code to uppercase
        $( stateId ).val( $(stateId).val().toUpperCase()	);
        $( sourceCodeId ).val(  $(sourceCodeId).val().toUpperCase());
        formatSourceCode(sourceCodeId);
    }
    
    function init(utils, modal, map) {
        setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) ;
        autocompleteDate(sourceDateId) ;
        autocompleteDate(contactDateId) ;
        // event listeners
        onZipCodeMultiSelectChange(cityId , availableCitiesId );
        onSetPresetBtnClick(sourceCodeId, sourceDateId , promoCodeId, marketerNameId) ;
        onStateBlur( zipId, addressId , cityId, stateId, utils, map ) ;
        utils.onZipCodeBlur( zipId, cityId, stateId,availableCitiesId, modal ) ;
        onSourceCodeBlur(sourceCodeId);
        onSubmitBtnClick( firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId )
    }

    return {
        init
    }
});