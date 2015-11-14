var mainJS = (function() {

    var 
        _spinnerX = $('.position-right__input-top'),
        _spinnerY = $('.position-right__input-bot'),
        positionBlock = $('.position'),
        inputX = positionBlock.find('.position-right__input-top'),
        inputY = positionBlock.find('.position-right__input-bot'),
        ajaxPOST = {
            urlMain: '',
            urlWater: '',
            opacity: 1,
            posX: 0,
            posY: 0,
            mode: 'normal',
            margX: 0,
            margY: 0
        },
        urlServer = 'php/compileImg.php';

    var Init = function() {
        _setupListners();
    };

    var _setupListners = function() {
        //FileUpload Function Start
        $('#fileuploadWat').on('change', _uploadInfoWat);
        $('#fileupload').on('change', _uploadInfo);

        //Disable letters function
        $('.position-right__input-top').on('click input keydown', function() {
            $(this).prop('disabled', true);
        });
        $('.position-right__input-bot').on('click input keydown', function() {
            $(this).prop('disabled', true);
        });

        //Disable Functions Start
        _disableFunc();
        _disableAlert();

        //Upload to Server 
        $('#upload').on('submit', _ajaxServer);

        //Reset function 
        resetForm();

        //Reset position function
        _setCoordinate(0,0);

        //Default Mode
        SingleMode();

        //Mode Selection
        $('.change-view__link_normal').on('click', function(event) {
            SingleMode()
        });
        $('.change-view__link_multi').on('click', function(event) {
            TillMode()
        });
    };

//Modes Functions
    var SingleMode = function() {
        watermark = $('.image-view__water-img');
        watermarkImg = $('.image-view__water-img');
        bgContainer = $('.image-view__main-img');
        parentDrag = bgContainer;
        opacity = watermark.css('opacity');
        ajaxPOST.mode = 'normal';

        $('.wrap-image-view__water-till-block').css('display', 'none');
        $('.image-view__water-img').css('display', 'block');

        $('.position-left__till').css('display', 'none');

        $('.position-right_arrow-vert').css('display', 'none');
        $('.position-right_arrow-hor').css('display', 'none');
        $('.position-right__vector').css('display', 'block');

        $(watermark).change(function(event) {
            console.log('I am hero')
        });

        $('#fileuploadWat').on('change', function(event) {

        });

        //Position Function Normal Mode
        _coordinates();
        _dragWatermark(watermark, parentDrag, _dragGetSlice);
        _getCoordinates();
        $('.position-left__list li').on('click touchstart', _gridChange);

        //Opacity Function Listen
        _opacity(watermark,opacity);
    }

    var TillMode = function() {
        watermark = $('.wrap-image-view__water-till-block');
        watermarkImg = $('.image-view__water-till-img');
        bgContainer = $('.image-view__container');
        parentDrag = '';
        opacity = watermark.css('opacity');
        ajaxPOST.mode = 'till';

        $('.image-view__water-img').css('display', 'none');
        $('.wrap-image-view__water-till-block').css('display', 'block');

        $('.position-left__list li').removeClass('position-left__item_active');
        $('.position-left__till').css('display', 'block');

        $('.position-right_arrow-vert').css('display', 'block');
        $('.position-right_arrow-hor').css('display', 'block');
        $('.position-right__vector').css('display', 'none');

        //Position Function Till Mode
        _dragWatermark(watermark, parentDrag, '');
        _paddingTill(watermarkImg, watermark);
        _getPaddingTill();
        //Opacity Function Listen
        _opacity(watermark,opacity);
    };


//Function Upload Name
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

//Position Function

    var  _dragWatermark = function(dragBlock, container, func) {
        dragBlock.draggable({
            containment: container,
            snapTolerance: 0,
            cursor: 'move',
            drag: func
            });
        };

    var _dragGetSlice = function(ev, ui){
            _getCoordinates();
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

    var _getCoordinates = function(elem) {
        
        var positionX = 0,
            positionY = 0,
            coordinate = 0;

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
        };

    var _setCoordinate = function (x,y) {
        inputX.val(Math.round(x));
        inputY.val(Math.round(y));
        };

    var _gridChange = function () {
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
            };

//Padding Spinners Functions
    var _paddingTill = function(watermark, watermarkBlock) {

        var widthImg = watermark.css('width').slice(0,-2),
            heightImg = watermark.css('height').slice(0,-2),
            widthElems = watermarkBlock.attr('data-x-elem'),
            heightElems = watermarkBlock.attr('data-y-elem'),
            widthBlock = 0,
            heightBlock = 0;

        _spinnerX.spinner({ min: 0, max: 100 });
        _spinnerX.on('spin', function(event, ui) {
            var currentValX = ui.value;

            watermark.css('padding-right', currentValX + 'px');
            widthBlock = ( widthImg + currentValX ) * widthElems;
            watermarkBlock.css('width', widthBlock);
            _setPaddingTill(currentValX,0);
        });

        _spinnerY.spinner({ min: 0, max: 100 });
        _spinnerY.on('spin', function(event, ui) {
            var currentValY = ui.value;

            watermark.css('padding-bottom', currentValY + 'px');
            heightBlock = ( heightImg + currentValY ) * heightElems;
            watermarkBlock.css('height', heightBlock);
            _setPaddingTill(0,currentValY);
        });
    };

    var _getPaddingTill = function(elem) {
        
        var paddingX = 0,
            paddingY = 0;

        if (typeof elem === 'undefined') {
            elem = watermarkImg;
        } 
        
            paddingX  = elem.css('padding-right').slice(0,-2);
            paddingY  = elem.css('padding-bottom').slice(0,-2) ;
            _setCoordinate(paddingX,paddingY);
            _setPaddingTill(paddingX,paddingY);

            return {
                x: paddingX,
                y: paddingY
            };
        };

    var _setPaddingTill = function(padX, padY) {

        var borderX = 0,
            borderY = 0;

        if ( !(padY == 0) ) {
            borderY = Math.round( padY / 2);
            $('.position-left__till-item_top-left').css('border-bottom-width', borderY);
            $('.position-left__till-item_top-right').css('border-bottom-width', borderY);
            $('.position-left__till-item_btm-left').css('border-top-width', borderY);
            $('.position-left__till-item_btm-right').css('border-top-width', borderY);
        }
        if ( !(padX == 0) ) {
            borderX = Math.round( padX / 2);
            $('.position-left__till-item_top-left').css('border-right-width', borderX);
            $('.position-left__till-item_top-right').css('border-left-width', borderX);
            $('.position-left__till-item_btm-left').css('border-right-width', borderX);
            $('.position-left__till-item_btm-right').css('border-left-width', borderX);
        }
    };

//Opacity Function
    var _opacity = function(water, opacValue) {
        $('.opacity__slider').slider({
            range: 'min',
            min: 0,
            max: 1,
            step: 0.01,
            value: opacValue,
            slide: function( event, ui ) {
                water.css('opacity', ui.value);
            }
        });
    };

//Reset Function
    var resetForm = function() {
        $('.buttons__reset').on('click', function(){
            $('.wrap-image-view__water-till-block').css('opacity', 1),
                watermark.css('left', 0),
                watermark.css('top', 0),
                inputX.spinner('value', 0),
                inputY.spinner('value', 0),
                $('.opacity__slider').slider("value", 1),
                watermark.css('opacity', 1)
        })
    };

//Disable Function
    var _disableFunc = function() {

        $('#fileupload').on('change', function() {
            $('.sidebar__disable').addClass('sidebar__disable_settings')
        });

        $('#fileuploadWat').on('change', function() {
            $('.sidebar__disable').addClass('sidebar__disable_none')
        });
    };

    var _disableAlert = function() {
        $('.sidebar__disable').on('click', function() {
            swal({
                title: 'Вы забыли выбрать изображения',
                text: 'Для включения настроек изменения водяного знака сначала выберите необходимые вам изображения!',
                confirmButtonText: "Продолжить работу"
            });
        });
    };

//Upload to Server Function
    var _ajaxServer = function (event) {
        event.preventDefault();

        ajaxPOST.urlMain = $('#mainFileText').val();
        ajaxPOST.urlWater = $('#waterFileText').val();
        ajaxPOST.posX = watermark.css('left').slice(0, -2);
        ajaxPOST.posY = watermark.css('top').slice(0, -2);
        ajaxPOST.opacity = watermark.css('opacity');
        ajaxPOST.margX = watermarkImg.css('padding-right').slice(0, -2);
        ajaxPOST.margY = watermarkImg.css('padding-bottom').slice(0, -2);

        var result = $.ajax({
                url: urlServer,
                type:'POST',
                dataType: 'json',
                data:'jsonData=' + JSON.stringify(ajaxPOST)
            })
            .fail(function(ans) {
                console.log('Проблемы в PHP');
            })
            .done(function(ans) {
                if (ans.status ==='OK') {
                    console.log(ans.text);
                    document.location = 'php/' + ans.url;
                } else {
                    console.log(ans.text);
                }
            });

        return result;
    };

    return {
        init: Init
    };

}());

mainJS.init();

//------------change languages buttons----------------
var lang = function () {
    var langInit = function () {
        _setupListners();
    };
    var _setupListners = function(){
        $('#eng').on('click', function(){
            $('.icons__lang-item').removeClass('active');
            $('#eng').addClass('active');
        });
        $('#rus').on('click', function(){
            $('#eng').removeClass('active');
            $('#rus').addClass('active');
        });
    };


    return {
        init: langInit
    }
}();

lang.init();

// popup -----------------------------------

var Popup = (function() {

    var popupInit = function() {
        _setUpListners();
    };

    var _setUpListners = function() {
        _popup();
    };

    var _popup = function() {

        $('.icons__instuctions_link').on('click', function(e) {
            e.preventDefault();

            $('.popup').bPopup({
                positionStyle: 'fixed',
                closeClass : 'popup-close',
            });
        });
    };

    return {
        init: popupInit
    };

}());

Popup.init();





















>>>>>>> e819fe648b6210028fd6c1c5a938a30d01aee42f
