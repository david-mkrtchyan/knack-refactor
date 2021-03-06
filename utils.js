const utils = (function () {
    const viewRenderPrefix = 'knack-view-render.';

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

    //removes all characters and spaces from a string
    function removeCharAndSpaces(str) {
        return str.replace(/[`~!@#$%^&*()/ /_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '');
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
    function disableInputDefaultAutoSuggest(fields = []) {
        fields.forEach(field => {
            let el = document.getElementById(field);
            el.setAttribute('autocomplete', 'off');
        })
    }

    function isTableEmpty(tableViewId) {
        console.log(tableViewId + " tbody tr");
        console.log($(tableViewId + " tbody tr"));
        return $(tableViewId + " tbody tr").hasClass('kn-tr-nodata');
    }

    function showAlertOnClickIfTableIsEmpty(buttonClass, tableViewId, message) {
        $(buttonClass).on('click', function () {
            if (isTableEmpty(tableViewId)) {
                alert(message);
                return false;
            }
        });
    }

    function showAlertOnClickIfTableIsNotEmpty(buttonClass, tableViewId, message) {
        $(buttonClass).on('click', function () {
            if (!isTableEmpty(tableViewId)) {
                alert(message);
                return false;
            }
        });
    }

    // updates the user to the most recent version of the app by reloading the page and updating their user record.
    function updateUserVersion(userId, updatedVersion) {
        var d = {
            "field_362": updatedVersion
        };
        $.ajax({
            url: "https://api.knack.com/v1/objects/object_4/records/" + userId,
            type: "PUT",
            headers: window.knackApiHeaders,
            data: JSON.stringify(d),
            success: function (data) {
                location.reload(true);
            },
            error: function (request, error) {
                console.log(error);
            }
        });
    }

    // checks the users version of the app then updates it if its not the most recent
    function checkVersion() {
        $.ajax({
            url: "https://api.knack.com/v1/objects/object_31/records",
            type: "GET",
            headers: knackApiHeaders,
            success: function (data) {
                if (Knack.getUserAttributes().values.field_362 !== data.total_records) {
                    updateUserVersion(Knack.getUserAttributes().id, data.total_records);
                } else {
                    console.log('is flase');
                }
            },
            error: function (request, error) {
                console.error(error);
            }
        });
    }

    return {
        getNum,
        onBlur,
        formatDate,
        specifyView,
        checkVersion,
        hideTableIfEmpty,
        removeCharAndSpaces,
        capitalizeFirstLetter,
        disableInputDefaultAutoSuggest,
        showAlertOnClickIfTableIsEmpty,
        showAlertOnClickIfTableIsNotEmpty
    }
})();