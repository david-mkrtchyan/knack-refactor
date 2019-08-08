const mask = (function () {

    // creates an email with phone number before @ sign if email doesn't exist
    function formatEmail(emailId, phoneId) {
        var phone = $(phoneId).val();
        if ($(emailId).val().length < 5 && phone.length > 5) {
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

    //html element attributes for phone number design in web and mobiile
    function initPhoneNumberConfigs(fields = []) {
        fields.forEach(field => {
            let phoneNumber = document.getElementById(field);
            phoneNumber.setAttribute('maxlength', 14);
            phoneNumber.setAttribute('type', 'tel');
            phoneNumber.setAttribute('pattern', '^\d{3}-\d{3}-\d{4}$');
        })
    }

    //adding dash formatted text to source code filed
    function addSourceCodeMask(input) {
        let str = input.value;
        if (str && str.length >= 2) {
            str = str.split('-').join('');
            input.value = str.substring(0, 2) + "-" + str.substring(2, str.length);
        }
    }

    return {
        formatEmail,
        addSourceCodeMask,
        setPhoneNumberMask,
        initPhoneNumberConfigs
    }
})();