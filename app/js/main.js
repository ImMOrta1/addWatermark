var mainJS = (function() {

    var watermark = $('.image-view__water-img'),
        _spinnerX = $('.position-right__input-top'),
        _spinnerY = $('.position-right__input-bot'),
        positionBlock = $('.position'),
        inputX = positionBlock.find('.position-right__input-top'),
        inputY = positionBlock.find('.position-right__input-bot'),
        bgContainer = $('.image-view__main-img'),
        parentDrag = bgContainer,
        positionX = 0,
        positionY = 0,
        coordinate = 0,
        ajaxPOST = {
            urlMain: '',
            urlWater: '',
            opacity: 1,
            posX: 0,
            posY: 0,
        },
        urlServer = 'php/compileImg.php';

    var Init = function() {
        _setupListners();
    };

    var _setupListners = function() {
        //FileUpload Function Start
        $('#fileuploadWat').on('change', _uploadInfoWat);
        $('#fileupload').on('change', _uploadInfo);

        //Disable Functions Start
        _disableFunc();
        _disableAlert();

        //Upload to Server 
        $('#upload').on('submit', _ajaxServer);

        //Reset Function 
        resetForm();

        //Position Functions Listen
        _dragWatermark(watermark, bgContainer);
        _coordinates();
        _getCoordinates();
        _setCoordinate();
        _setCoordinate(0,0);
        $('.position-left__list li').on('click touchstart', _gridChange);

        //Opacity Function Listen
        _opacity();

        //Upload to Server 
        $('#upload').on('submit', _ajaxServer);watermark.css('top');

        //Mode Selection
        $('#checkModeNormal').on('click', function(event) {
            SingleMode()
        });
        $('#checkModeTilling').on('click', function(event) {
            TillMode()
        });
    };

//Modes Functions
    var SingleMode = function() {
        watermark = $('.image-view__water-img');
        bgContainer = $('.image-view__main-img');
        positionX = 0,
        positionY = 0;
        coordinate = 0;
        parentDrag = bgContainer;

        $('.wrap-image-view__water-till-block').css('display', 'none');
        $('.image-view__water-img').css('display', 'block');

        _dragWatermark(watermark, parentDrag);
    }

    var TillMode = function() {
        watermark = $('.wrap-image-view__water-till-block');
        bgContainer = $('.image-view__container');
        positionX = 0,
        positionY = 0;
        coordinate = 0;
        parentDrag = '';

        $('.image-view__water-img').css('display', 'none');
        $('.wrap-image-view__water-till-block').css('display', 'block');

        _dragWatermark(watermark, parentDrag);
    }


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

//Position Funstions

    var  _dragWatermark = function(dragBlock, container) {
        dragBlock.draggable({
            containment: container,
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

        };

    var _getCoordinates = function(elem) {
            
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

//Opacity Function
    var _opacity = function() {
        $('.opacity__slider').slider({
            range: 'min',
            min: 0,
            max: 1,
            step: 0.01,
            value: 1,
            slide: function( event, ui ) {
                $('.image-view__water-img').css('opacity', ui.value);
                ajaxPOST.opacity = ui.value;
            }
        });
    };

//Reset Funciton
    var resetForm = function() {
        $('.buttons__reset').on('click', function(){
            $('.image-view__water-img').css('left', 0),
            $('.image-view__water-img').css('top', 0),
                $('.position-right__input-top').spinner('value', 0),
                $('.position-right__input-bot').spinner('value', 0),
                $('.opacity__slider').slider("value", 1),
                $('.image-view__water-img').css('opacity', 1)
        })
    };

//Disable Functions
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
                title: 'АХТУНГ, Вы забыли выбрать изображения',
                text: 'Для включения настроек изменения водяного знака сначала выберите необходимые вам изображения!',
                type: "error",

                confirmButtonText: "Продолжить работу"
            });
        });
    };

//Upload to Server Function
    var _ajaxServer = function (event) {
        event.preventDefault();

        ajaxPOST.urlMain = $('#mainFileText').val();
        ajaxPOST.urlWater = $('#waterFileText').val();
        ajaxPOST.posX = watermark.css('top');
        ajaxPOST.posY = watermark.css('left');

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

//------------change languages----------------
var lang = function () {
    var langInit = function () {
        _setupListners();
    }
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

