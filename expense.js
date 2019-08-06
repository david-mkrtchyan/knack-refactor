const expense = (function () {
    // hides the employee field and uses it to check if the employee whose report it is has a higher mileage rate;
    function getMileageRateUsingForm() {
        $("#kn-input-field_219").hide();
        let isPersonWithHigherRate =  $("#kn-input-field_219").text().toLowerCase().includes('salgado') ;
        return isPersonWithHigherRate ? .45 : .35 ;
    }

    function getMileageRateByUser() {
        return Knack.getUserAttributes() != undefined ? Knack.getUserAttributes().values.field_247 : .35 ;
    }

// calculates total cost of mileage and tolls ;
    function calculateTravelExpense(user) {
        var beginningMileageId = "#field_225" ;
        var endingMileageId = "#field_226";
        var amountId= "#field_222";
        var tollsId = "#field_252";
        var expSourceCodeId = "#field_250";
        var dailyMileageDeduct = "#field_267";
        var maxExpense = 1000;
        var mileageDeduct = 40;
        var tolls = getNum(tollsId);
        var mileageRate = user ?  getMileageRateByUser() :  getMileageRateUsingForm() ;
        var deduct = $(dailyMileageDeduct).val() == "No"? 0 : mileageRate * mileageDeduct ;
        var totalMiles = getNum(endingMileageId) - getNum(beginningMileageId) ;
        var total = totalMiles > 40 ? +(totalMiles * mileageRate) - deduct + tolls : tolls;

        total = total < 0 ? 0 : total ;
        total = total > maxExpense ? 0 : total ;
        if ( tolls > 0 || $(endingMileageId).val().length > 0) {
            $(amountId).val(total.toFixed(2) );
            $(amountId).prop('disabled', true);
        } else {
            $(amountId).prop('disabled', false);
        }
    }

    // for all add expense form views use this code, there is a temp band aid in there.
    function setupAddExpenseForm(isCalculatedByLoggedInUser) {
        var categoryId = "#kn-input-field_238 .select";
        var categoryIdChzn = "#connection-picker-chosen-field_238 .chzn-container";
        var beginningMileageId = "#field_225" ;
        var endingMileageId = "#field_226";
        var amountId= "#field_222";
        var tollsId = "#field_252" ;
        var expSourceCodeId = "#field_250";
        var receiptId= "#field_227_upload";

        // hide employee field if mileagerate is false meaning its not user
        if(!isCalculatedByLoggedInUser){
            calculateTravelExpense(isCalculatedByLoggedInUser)
        }

        $(beginningMileageId).on("blur", function(){
            calculateTravelExpense(isCalculatedByLoggedInUser)
        });

        $(endingMileageId).on("blur", function(){
            calculateTravelExpense(isCalculatedByLoggedInUser)
        });

        $(tollsId).on('blur',function(){
            calculateTravelExpense(isCalculatedByLoggedInUser);
        });

        // this is in case anyone puts a symbol other then a period in the amount field it removes it.
        $(amountId).on("blur",function(){
            $(this).val( $(this).val().replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '') );
        });

        // When expense category gets changed all input fields get cleared
        $(categoryId).on("change", function(){
            $(amountId).val(" ");
            $(beginningMileageId).val(0);
            $(endingMileageId).val(0);
            $(tollsId).val(0);
            $(amountId).prop('disabled', false);
        });

        // shows alert on submit if receipt is needed
        $(".kn-form .kn-button").on('click',function() {
            var hasReceipt = $('#kn-input-field_227 .kn-asset-current').text().trim(" ").length != 0 ;
            var isTravelExpense = $(categoryIdChzn + " a span").text().toLowerCase() == "travel" ;
            var tolls = getNum(tollsId);

            if ( isTravelExpense ){
                calculateTravelExpense(isCalculatedByLoggedInUser)
            }

            if (tolls > 0 &  isTravelExpense && !hasReceipt ){
                alert('Please add a receipt for your toll');
                return false ;
            }

            if ( ! isTravelExpense && !hasReceipt ){
                alert("Please make sure you have selected the expense category and added a receipt if its a non mileage expenses");
                return false ;
            }
        });
    }

    function init(utils, modal, map, isCalculatedByLoggedInUser) {
        setupAddExpenseForm(isCalculatedByLoggedInUser)

    }

    return {
        init
    }
})();