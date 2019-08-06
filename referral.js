const referral = (function () {
    function hideSalesPersonFieldIfExist() {
        let api_url = 'https://api.knack.com/v1/objects/object_25/records';
        let filters = [
            {
                field: "field_296",
                operator: "is",
                value: Knack.user.attributes.values.email.email,
            }
        ];
        api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
        setTimeout(() => Knack.showSpinner());
        $.ajax({
            url: api_url,
            dataType: 'json',
            type: "GET",
            headers: window.knackApiHeaders,
            success: function (res) {
                if (res.records[0].field_307_raw.length) {
                    $('#kn-input-field_343').hide();
                }
                Knack.hideSpinner();
            },
            error: function ( request, error ) {
                Knack.hideSpinner();
            }
        });
    }

    function init(utils, modals, map) {
        console.log('map', map)
        hideSalesPersonFieldIfExist();
    }

    return {
        init
    }
})();