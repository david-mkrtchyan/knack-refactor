const utils = (function () {
    const viewRenderPrefix: 'knack-view-render.'

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
    function disableInputDefaultAutosuggest(fields = []) {
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

    return {
        round,
        getNum,
        onBlur,
        formatDate,
        formatEmail,
        specifyView,
        createContact,
        hideTableIfEmpty,
        setPhoneNumberMask,
        getRegionByZipCode,
        removeCharAndSpaces,
        setPhoneNumberFormat,
        capitalizeFirstLetter,
        initPhoneNumberConfigs,
        disableInputDefaultAutosuggest
    }
})()