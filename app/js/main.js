var opacitySlider = (function() {

    var sliderInit = function() {
        _setupListners();
    };

    var _setupListners = function() {
        _opacity();
    };

    var _opacity = function() {
        $('.opacity__slider').slider({
            range: 'min',
            min: 0, 
            max: 1, 
            step: 0.01, 
            value: 1,
            slide: function( event, ui ) {
                 $('.image-view__watermark').css('opacity', ui.value)
            }
        });
    };

    return {
        init: sliderInit
    };

}());

opacitySlider.init();