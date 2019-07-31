const cookies = (function () {
    // creates the preset cookies
    function createCookies(){
        // creates the preset cookies
        $.cookie("sourceDatePreset",	$("#sourceDatePreset").val()	);
        $.cookie("sourceCodePreset", $("#sourceCodePreset").val().toUpperCase() );
        $.cookie("promoCodePreset", $("#promoCodePreset").val().toUpperCase()  );
        $.cookie("marketerNamePreset", $("#marketerNamePreset").val() 	);
    }

    return {
        createCookies,
    }
})();