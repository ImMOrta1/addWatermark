
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
        _getCoordinates();
        _setCoordinate();
        _setCoordinate(0,0);
        $('.position-left__list li').on('click touchstart', _gridChange);
    };

    var watermark = $('.image-view__water-img'),
        _spinnerX = $('.position-right__input-top'),
        _spinnerY = $('.position-right__input-bot'),
        positionBlock = $('.position'),
        inputX = positionBlock.find('.position-right__input-top'),
        inputY = positionBlock.find('.position-right__input-bot'),
        bgContainer = $('.image-view__main-img'),
        positionX = 0,
        positionY = 0;
        coordinate = 0;

    var  _dragWatermark = function() {
        watermark.draggable({
            containment: bgContainer,
            snapTolerance: 0,
            cursor: 'move',
             drag: function(ev, ui){
                    _getCoordinates();
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

    },

        _getCoordinates = function(elem) {
            

        if (typeof elem === 'undefined') {
            elem = watermark;
        }   

            coordinate = elem.position();
            positionX  = Math.round( (coordinate.left) );
            positionY  = Math.round( (coordinate.top) );
            _setCoordinate(positionX,positionY);

            return {
                x: positionX,
                y: positionY
            };
        },

        _setCoordinate = function (x,y) {
            inputX.val(Math.round(x));
            inputY.val(Math.round(y));
        },

        _gridChange = function () {
            var 
                minPosX = 0,
                minPosY = 0,
                midPosX = (bgContainer.width() - watermark.width()) / 2,
                midPosY = (bgContainer.height() - watermark.height()) / 2,
                maxPosX = bgContainer.width() - watermark.width(),
                maxPosY = bgContainer.height() - watermark.height(),
                $this = $(this),
                position = $this.data('pos');
                $this.addClass('position-left__item_active').siblings().removeClass('position-left__item_active');
                switch (position) {
                    case 'top-left':
                        watermark.css({'left':minPosX, 'top':minPosY});
                        _setCoordinate(minPosX,minPosY);
                        break;
                    case 'top-center':
                        watermark.css({'left':midPosX, 'top':minPosY});
                        _setCoordinate(midPosX,minPosY);
                        break;
                    case 'top-right':
                        watermark.css({'left':maxPosX, 'top':minPosY});
                        _setCoordinate(maxPosX,minPosY);   
                        break;
                    case 'mid-left':
                        watermark.css({'left':minPosX, 'top':midPosY});
                        _setCoordinate(minPosX,midPosY);   
                        break;
                    case 'mid-center':
                        watermark.css({'left':midPosX, 'top':midPosY});
                        _setCoordinate(midPosX,midPosY);   
                        break;
                    case 'mid-right':
                        watermark.css({'left':maxPosX, 'top':midPosY});
                        _setCoordinate(maxPosX,midPosY);   
                        break;
                    case 'btm-left':
                        watermark.css({'left':minPosX, 'top':maxPosY});
                        _setCoordinate(minPosX,maxPosY);
                        break;
                    case 'btm-center':
                        watermark.css({'left':midPosX, 'top':maxPosY});
                        _setCoordinate(midPosX,maxPosY);
                        break;
                    case 'btm-right':
                        watermark.css({'left':maxPosX, 'top':maxPosY});
                        _setCoordinate(maxPosX,maxPosY);   
                        break;                       
                        
                }

        }

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
