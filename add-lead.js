const addLead = (function () {
    //global variables
    let map, utils, modal, cookies, mask = {};

    let firstNameId = "#first";
    let lastNameId = "#last";
    let emailId = "#field_26";
    let phoneId = "#field_189";
    let zipId = "#field_188";
    let cityId = "#field_186";
    let availableCitiesId = "#addLead-field_194";

    let stateId = "#addLead-field_187";
    let addressId = "#field_185";
    let sourceCodeId = "#field_190";
    let sourceDateId = "#addLead-field_107";
    let contactDateId = "#addLead-field_151";
    let promoCodeId = "#field_192";
    let marketerNameId = "#addLead-field_38";

    function autocompleteDate(dateFieldId) {
        let dateInfo = new Date();
        let month = dateInfo.getMonth();
        let year = dateInfo.getFullYear();

        $(dateFieldId).keyup(function () {
            if ($(this).val().length == 2) {
                $(this).val($(this).val() + "/");
            } else if ($(this).val().length == 5) {
                $(this).val($(this).val() + "/" + year);
            }
        });
    }

    // when set preset button is clicked it creates the presets and updates the fields in the form.
    function onSetPresetBtnClick(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) {
        $("#setPresetsBtn").on("click", function () {
            cookies.createCookies();
            setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId);
        });
    }

    //  sets the all preset fields and form fields with the cookie for the preset.
    function setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId) {
        let sourceCode = $.cookie("sourceCodePreset");
        let sourceDate = $.cookie("sourceDatePreset");
        let promoCode = $.cookie("promoCodePreset");
        let marketerName = $.cookie("marketerNamePreset");

        //sets preset fields
        $("#sourceCodePreset").val(sourceCode);
        $("#sourceDatePreset").val(sourceDate);
        $("#promoCodePreset").val(promoCode);
        $("#marketerNamePreset").val(marketerName);

        // sets form fields
        $(sourceCodeId).val(sourceCode);
        $(sourceDateId).val(sourceDate);
        $(promoCodeId).val(promoCode);
        if (marketerName != null) {
            setMarketerName(marketerNameId, marketerName);
        }
    }

    // loops through all marketer name options find the matching one and sets it to selected then updates the text.
    function setMarketerName(marketerNameId, marketerName) {
        // field for chosen select box
        var chosenId = marketerNameId.replace("-", "_") + "_chzn";
        $(marketerNameId + ' option').each(function () {
            if ($(this).text().toLowerCase() == marketerName.toLowerCase()) {

                $(this).attr("selected", true).change();
                $(this).prop("selected", true).change();
                $("#view_186_field_38_chzn" + ' a span').text($(this).text());
            }
        });
    }

// searches for zip code based on the city and state.
    function onStateBlur(zipFieldId, addressFieldId, cityFieldId, stateFieldId, leadsHelper) {
        var address = '';
        var city = '';
        var state = '';

        utils.onBlur(stateFieldId, function (info) {
            address = $(addressFieldId).val();
            city = $(cityFieldId).val();
            state = $(stateFieldId).val();
            if (city.length > 2 && state.length > 1) {
                map.getCityStateAddressInfo(address, city, state, function (res) {
                    var zip = leadsHelper.getAddressInfo(res, cityFieldId, modal)[0];
                    $(zipFieldId).val(zip);
                });
            }
        });
    }

    function onZipCodeMultiSelectChange(cityId, availableCitiesId) {
        $(availableCitiesId).on("change", function () {
            $(cityId).val($(this).val());
        });
    }

    //runs on blur of source code
    function onSourceCodeBlur(sourceCodeId) {
        $(sourceCodeId).on("blur", function () {
            formatSourceCode(sourceCodeId);
        });
    }

    // when submit button click it format's the form then returns true;
    function onSubmitBtnClick(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId) {
        $(".kn-button").on("click", function () {
            formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId);
            return true;
        });
    }

    //adding dash after Source code letters(first 2 characters)
    function formatSourceCode(sourceCodeId) {
        var formattedSourceCode = $(sourceCodeId).val().toUpperCase();
        if (formattedSourceCode.length === 5) {
            formattedSourceCode = [formattedSourceCode.slice(0, 2), "-", formattedSourceCode.slice(2)].join('').toUpperCase();
        }
        $(sourceCodeId).val(formattedSourceCode);
    }

    // formats the form
    function formatForm(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId) {
        // adds phone to email if email doesn't exist
        mask.formatEmail(emailId, phoneId);
        $(phoneId).val(utils.removeCharAndSpaces($(phoneId).val()));

        // capitilize name first letters
        $(firstNameId).val(utils.capitalizeFirstLetter($(firstNameId).val()));
        $(lastNameId).val(utils.capitalizeFirstLetter($(lastNameId).val()));

        //sets state and source code to uppercase
        $(stateId).val($(stateId).val().toUpperCase());
        $(sourceCodeId).val($(sourceCodeId).val().toUpperCase());
        formatSourceCode(sourceCodeId);
    }

    function init(_utils, _modal, _map, _cookies, _mask, leadsHelper) {
        utils = _utils;
        modal = _modal;
        map = _map;
        cookies = _cookies;
        mask = _mask;
        setPresetFields(sourceCodeId, sourceDateId, promoCodeId, marketerNameId);
        autocompleteDate(sourceDateId);
        autocompleteDate(contactDateId);
        // event listeners
        onZipCodeMultiSelectChange(cityId, availableCitiesId);
        onSetPresetBtnClick(sourceCodeId, sourceDateId, promoCodeId, marketerNameId);
        onStateBlur(zipId, addressId, cityId, stateId, leadsHelper);
        leadsHelper.onZipCodeBlur(zipId, cityId, stateId, availableCitiesId);
        onSourceCodeBlur(sourceCodeId);
        onSubmitBtnClick(firstNameId, lastNameId, emailId, phoneId, stateId, sourceCodeId)
    }

    return {
        init
    }
});