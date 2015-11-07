var Unity = (function() {



    var sliderInit = function() {
        _setupListners();

    };

        var _setupListners = function() {
            _opacity();
            _dragImage();
            _coordinates();
            $('#fileupload').on('change', _uploadInfo);
            $('#fileuploadWat').on('change', _uploadInfoWat);
        };

        var watermark = $('.image-view__water-img');
            _spinnerX = $('.position-right__input-top'),
            _spinnerY = $('.position-right__input-bot')

        var  _dragImage = function() {
            watermark.draggable({
                containment: 'parent',
                drag: function (event, ui) {

                    var x = $('.image-view__water-img').css('top'),
                        y = $('.image-view__water-img').css('left');

                    console.log(x);
                    console.log(y);
                }

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
        var _uploadInfo = function (){
             var $input = $(this),
                 val = $input.val().slice(12),
                 fileName = $('#fake');
                 fileName.text(val);
        }
        var _uploadInfoWat = function (){
             var $input = $(this),
                 val = $input.val().slice(12),
                 fileName = $('#fakeWat');
             fileName.text(val);
        }

    return {
        init: sliderInit
    };

}());

Unity.init();