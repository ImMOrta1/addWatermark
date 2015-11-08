
//Input file name module -----------------------------------
var fileUpload = (function() {

    var InputInit = function() {
        _setupListners();
    };

    var _setupListners = function() {

        $('#fileuploadWat').on('change', _uploadInfoWat);
        $('#fileupload').on('change', _uploadInfo);
    };

    var _uploadInfo = function (){
        var $input = $(this),
            val = $input.val().slice(12),
            fileName = $('#fake');
            fileName.text(val);
    };
    var _uploadInfoWat = function (){
        var $input = $(this),
            val = $input.val().slice(12),
            fileName = $('#fakeWat');
            fileName.text(val);
    };




    return {
        init: InputInit
    };

}());

fileUpload.init();


//position module ----------------------------------------
var positionModule = (function() {

    var positionInit = function() {
        _setupListners();
    };

    var _setupListners = function() {
        _dragWatermark();
        _coordinates();
    };

    var watermark = $('.image-view__water-img');
        _spinnerX = $('.position-right__input-top'),
        _spinnerY = $('.position-right__input-bot');

    var  _dragWatermark = function() {
        watermark.draggable({
            containment: 'parent'
        });
    };

    var _coordinates = function() {

        _spinnerX.spinner({ min: 0, max: 650 });
        _spinnerX.on('spin', function(event, ui) {
            var currentValX = ui.value;

            watermark.css({
                left: currentValX + 'px'
            })
        });

        _spinnerY.spinner({ min: 0, max: 530 });
        _spinnerY.on('spin', function(event, ui) {
            var currentValY = ui.value;

            watermark.css({
                top: currentValY + 'px'
            })
        });

    };

    return {
        init: positionInit
    };

}());

positionModule.init();


// opacity module ----------------------------------------
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
                $('.image-view__water-img').css('opacity', ui.value)
            }
        });
    };

    return {
        init: sliderInit
    };

}());

opacitySlider.init();

//------------Reset function----------------

var resetForm = (function(){
    var resetInit = function(){
        _setupListners();
    };

    var _setupListners = function(){
        $('.buttons__reset').on('click', function(){
            $('.image-view__water-img').slider("value", 1)
        })
    };


    return{
        init: resetInit
    }
}());

resetForm.init();







