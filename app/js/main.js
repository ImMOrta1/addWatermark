// ------------ Функция работы с изображениями ----------------

var mainJS = (function() {

    // Постоянные и начальные параметры скрипта
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

        // Начальный значения функций при загрузке
        _setCoordinate(0,0);
        SingleMode();
    };

    // Прослушивание событий
    var _setupListners = function() {

        // Блокируем для ввода спинеры
        $('.position-right__input-top').on('click input keydown', function() {
            $(this).prop('disabled', true);
        });
        $('.position-right__input-bot').on('click input keydown', function() {
            $(this).prop('disabled', true);
        });

        // Отправка данных на сервер
        $('#upload').on('submit', _ajaxServer);

        // Обработка событий, при нажатии на кнопки выбора режима замощения
        $('.change-view__link_normal').on('click', function(event) {
            event.preventDefault();
            SingleMode()
        });
        $('.change-view__link_multi').on('click', function(event) {
            event.preventDefault();
            TillMode()
        });
    };

// Функция режима одиночного водяного знака
    var SingleMode = function() {

        // Определяем элементы и значения, с которыми будем работать
        watermark = $('.image-view__water-img');
        watermarkImg = $('.image-view__water-img');
        bgContainer = $('.image-view__main-img');
        parentDrag = bgContainer;
        opacity = watermark.css('opacity');
        ajaxPOST.mode = 'normal';
        widthMain = bgContainer.css('width').slice(0, -2);
        heightMain = bgContainer.css('height').slice(0, -2);
        widthWatermark = watermark.css('width').slice(0, -2);
        heightWatermark = watermark.css('height').slice(0, -2);

        // Определяем поведение элементов при переключении режимов
        $('.wrap-image-view__water-till-block').css('display', 'none');
        $('.image-view__water-img').css('display', 'block');
        $('.position-left__till').css('display', 'none');
        $('.position-right_arrow-vert').css('display', 'none');
        $('.position-right_arrow-hor').css('display', 'none');
        $('.position-right__vector').css('display', 'inline-block');
        $('.change-view__link_normal').removeClass('active');
        $('.change-view__link_normal').addClass('active');
        $('.change-view__link_multi').removeClass('active');

        // Если было загружено другое главное изображение и водяной знак оказался за пределами блок с ней
        // переносим её в новый блок с главным изображением
        positionFix('width','left',watermark,bgContainer);
        positionFix('height','top',watermark,bgContainer);

        // Инициализируем функции работы с перемещением и координатами 
        _coordinates( widthMain - widthWatermark, heightMain - heightWatermark);
        _dragWatermark(watermark, parentDrag, _dragGetSlice);
        _getCoordinates();

        // Инициализируем сетку позиционирования
        $('.position-left__list li').on('click touchstart', _gridChange);

        // Инициализируем изменение прозрачности для марки в этом режиме
        _opacity(watermark,opacity);
    };

    var TillMode = function() {

        // Определяем элементы и значения, с которыми будем работать
        watermark = $('.wrap-image-view__water-till-block');
        watermarkImg = $('.image-view__water-till-img');
        bgContainer = $('.image-view__container');
        parentDrag = '';
        opacity = watermark.css('opacity');
        ajaxPOST.mode = 'till';

        // Определяем поведение элементов при переключении режимов
        $('.image-view__water-img').css('display', 'none');
        $('.wrap-image-view__water-till-block').css('display', 'block');
        $('.position-left__list li').removeClass('position-left__item_active');
        $('.position-left__till').css('display', 'block');
        $('.position-right_arrow-vert').css('display', 'inline-block');
        $('.position-right_arrow-hor').css('display', 'inline-block');
        $('.position-right__vector').css('display', 'none');
        $('.change-view__link_multi').removeClass('active');
        $('.change-view__link_multi').addClass('active');
        $('.change-view__link_normal').removeClass('active');

        // Инициализируем функции перемещения и изменения растояния между замощаемыми элементами
        _dragWatermark(watermark, parentDrag, '');
        _paddingTill(watermarkImg, watermark);
        _getPaddingTill(watermarkImg, watermark);

        // Инициализируем изменение прозрачности для марки в этом режиме
        _opacity(watermark,opacity);
    };

// Функции отвечающие за позиционирование
    // Функции отвечающие за перемещение элементов внутри заданного блока
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

    // Функция работы спинеров в режиме одной марки
    // принимает значения максимально возможных координат по X и Y
    var _coordinates = function(maxX,maxY) {

        // Спинер X координаты
        _spinnerX.spinner({ min: 0, max: maxX });
        _spinnerX.on('spin', function(event, ui) {
            var currentValX = ui.value;

            // Запись значения спинера в водяной знак
            watermark.css({
                left: currentValX + 'px'
            })
        });

        // Спинер Y координаты
        _spinnerY.spinner({ min: 0, max: maxY });
        _spinnerY.on('spin', function(event, ui) {
            var currentValY = ui.value;

            // Запись значения спинера в водяной знак
            watermark.css({
                top: currentValY + 'px'
            })
        });
    };

    // Обработка результатов перемещия марки в блоке
    var _getCoordinates = function() {
        
        var positionX = 0,
            positionY = 0,
            coordinate = 0;

            coordinate = watermark.position();
            positionX  = Math.round( (coordinate.left) );
            positionY  = Math.round( (coordinate.top) );
            _setCoordinate(positionX,positionY);

            return {
                x: positionX,
                y: positionY
            };
        };

    // Ввод координат в поля ввода спинеров
    var _setCoordinate = function (x,y) {
        inputX.val(Math.round(x));
        inputY.val(Math.round(y));
        };

    // Функция работы сетки позиционирования
    var _gridChange = function (event) {
            event.preventDefault();

            // Вычисляем максимальные и минимальные значения координат
            var 
                minPosX = 0,
                minPosY = 0,
                midPosX = (bgContainer.width() - watermark.width()) / 2,
                midPosY = (bgContainer.height() - watermark.height()) / 2,
                maxPosX = bgContainer.width() - watermark.width(),
                maxPosY = bgContainer.height() - watermark.height(),

                // Определяем параметры нажатого элемента
                $this = $(this),
                position = $this.data('pos');
                $this.addClass('position-left__item_active').siblings().removeClass('position-left__item_active');

                // Позиционируем марку
                switch (position) {
                    case 'top-left':
                        watermark.stop().animate({'left':minPosX, 'top':minPosY}, 200)
                        _setCoordinate(minPosX,minPosY);
                        break;
                    case 'top-center':
                        watermark.stop().animate({'left':midPosX, 'top':minPosY}, 200)
                        _setCoordinate(midPosX,minPosY);
                        break;
                    case 'top-right':
                        watermark.stop().animate({'left':maxPosX, 'top':minPosY}, 200)
                        _setCoordinate(maxPosX,minPosY);   
                        break;
                    case 'mid-left':
                        watermark.stop().animate({'left':minPosX, 'top':midPosY}, 200)
                        _setCoordinate(minPosX,midPosY);   
                        break;
                    case 'mid-center':
                        watermark.stop().animate({'left':midPosX, 'top':midPosY}, 200)
                        _setCoordinate(midPosX,midPosY);   
                        break;
                    case 'mid-right':
                        watermark.stop().animate({'left':maxPosX, 'top':midPosY}, 200)
                        _setCoordinate(maxPosX,midPosY);   
                        break;
                    case 'btm-left':
                        watermark.stop().animate({'left':minPosX, 'top':maxPosY}, 200)
                        _setCoordinate(minPosX,maxPosY);
                        break;
                    case 'btm-center':
                        watermark.stop().animate({'left':midPosX, 'top':maxPosY}, 200)
                        _setCoordinate(midPosX,maxPosY);
                        break;
                    case 'btm-right':
                        watermark.stop().animate({'left':maxPosX, 'top':maxPosY}, 200)
                        _setCoordinate(maxPosX,maxPosY);   
                        break;                                 
                }
            };

// Функции отвечающие за замощение элементов
    // Функция работы спинеров в режиме замощения
    var _paddingTill = function(watermark, watermarkBlock) {

        // Определяем параметры замощенной марки
        var widthImg = watermark.css('width').slice(0,-2),
            heightImg = watermark.css('height').slice(0,-2),
            widthElems = watermarkBlock.attr('data-x-elem'),
            heightElems = watermarkBlock.attr('data-y-elem'),
            widthBlock = 0,
            heightBlock = 0;

        // Работа спинера горизонатальных отступов
        _spinnerX.spinner({ min: 0, max: 100 });
        _spinnerX.on('spin', function(event, ui) {
            var currentValX = ui.value;

            // Перерасчет замощаемых элементов
            watermark.css('padding-right', currentValX + 'px');
            widthBlock = ( Number(widthImg) + Number(currentValX) ) * widthElems;
            watermarkBlock.css('width', widthBlock);

            // Изменение сетки замощения
            _setPaddingTill(currentValX,0);
        });


        // Работа спинера вертикальных отступов
        _spinnerY.spinner({ min: 0, max: 100 });
        _spinnerY.on('spin', function(event, ui) {
            var currentValY = ui.value;

            // Перерасчет замощаемых элементов
            watermark.css('padding-bottom', currentValY + 'px');
            heightBlock = ( Number(heightImg) + Number(currentValY) ) * heightElems;
            watermarkBlock.css('height', heightBlock);

            // Изменение сетки замощения
            _setPaddingTill(0,currentValY);
        });
    };

    // Обработка данных замощаемого элемента
    var _getPaddingTill = function(watermark, watermarkBlock) {

        // Определяем параметры замощенной марки
        var widthImg = watermark.css('width').slice(0,-2),
            heightImg = watermark.css('height').slice(0,-2),
            widthElems = watermarkBlock.attr('data-x-elem'),
            heightElems = watermarkBlock.attr('data-y-elem');
        
        // Узнаем отступы у элементов
        paddingX  = watermark.css('padding-right').slice(0,-2);
        paddingY  = watermark.css('padding-bottom').slice(0,-2);

        //Выясянем ширину и высоту блока
        widthBlock = ( Number(widthImg) + Number(paddingX) ) * widthElems;
        heightBlock = ( Number(heightImg) + Number(paddingY) ) * heightElems;

        // Применяем параметры
        _setCoordinate(paddingX,paddingY);
        _setPaddingTill(paddingX,paddingY);
        watermarkBlock.css({
            width: widthBlock,
            height: heightBlock
        });

        return {
            x: paddingX,
            y: paddingY
        };
    };

    // Функция изменения сетки замощения
    var _setPaddingTill = function(padX, padY) {

        var borderX = 0,
            borderY = 0;

        // При изменении значения спинеров, изменяется 'плюс' на месте сетки позиционирования
        // в соотношении на каждый два значения спинера - одно изменение границ 'плюса' 
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

// Функция работы слайдера прозрачности
// на входе элемент, которому будем изменять прозрачность
// и значение в даннный момент
    var _opacity = function(water, opacValue) {

        // Инициализируем
        $('.opacity__slider').slider({

            //Вводим параметры слайдера
            range: 'min',
            min: 0,
            max: 1,
            step: 0.01,
            value: opacValue,
            slide: function( event, ui ) {

                // Изменяем прозрачность
                water.css('opacity', ui.value);
            }
        });
    };

// Функция исправляющая ситуацию, когда водяной знак, при изменении главной картинки
// мог оказаться за пределами нового блока
// принимает значнеия
// mode - режим height или width (выбираем с чем работать у блока главной картинки)
// mode-pos - режим top или left (выбираем с чем работать у водяного знака)
// mark - сам водяной знак
// main - главная картинка
    var positionFix = function(mode, mode_pos, mark, main) {
        // Достаем значения из элементов согласно режимам
        var param1 = $(mark).css(mode_pos).slice(0, -2),
            param2 = $(mark).css(mode).slice(0, -2),
            param3 = $(main).css(mode).slice(0, -2),
            // Вычисляем позицию дальней стороны водяного знака
            ifParam = Number(param1) + Number(param2),
            // Вычисляем максимально возможное значение положения знака
            result = Number(param3) - Number(param2);

        // Если водяной знак вышел за рамки нового главного изображения
        // перемещаем его в новый блок и прибиваем к границе
        if (ifParam > param3) {
            $(mark).css(mode_pos,result)
        }
    };

// Функция отправки итогового изображения на сервер
// и скачивания результата
    var _ajaxServer = function (event) {
        event.preventDefault();

        // Формируем объект для отправки на сервер
        ajaxPOST.urlMain = $('#mainFileText').val();
        ajaxPOST.urlWater = $('#waterFileText').val();
        ajaxPOST.posX = watermark.css('left').slice(0, -2);
        ajaxPOST.posY = watermark.css('top').slice(0, -2);
        ajaxPOST.opacity = watermark.css('opacity');
        ajaxPOST.margX = watermarkImg.css('padding-right').slice(0, -2);
        ajaxPOST.margY = watermarkImg.css('padding-bottom').slice(0, -2);

        // Инициализируем AJAX запрос на сервер 
        var result = $.ajax({
                // Адрес php файла обработчика
                url: urlServer,
                // Метод, с помощью которого отправляем
                type:'POST',
                // Тип передаваемых данных
                dataType: 'json',
                // Сами данные, который преобразуем из объекта в JSON строку
                data:'jsonData=' + JSON.stringify(ajaxPOST)
            })
            // Функция выполняющаяся при ошибке на серверной стороне
            .fail(function(ans) {
                console.log('Проблемы в PHP');
            })
            // Функция выполняющаяся при удачном выполнении скрипта на сервере
            .done(function(ans) {
                // Если все прошло без ошибок
                if (ans.status ==='OK') {
                    // Выводим в консоль сообщение
                    console.log(ans.text);
                    // Генерируем ссылку для скачивания файла(с помощью отправки GET методом в другой PHP скрипт) 
                    window.location = 'php/download.php?url=' + ans.url;
                } else {
                    // Если все плохо, выводим что плохо
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

// ------------ Функция работы кнопок смены языков ----------------

var lang = function () {
    var langInit = function () {
        _setupListners();
    };
    var _setupListners = function(){
        // В зависимости от того, какая кнопка нажата,
        // запускается функция с параметрами rus или eng
        $('#eng').on('click', function(){
            $('.icons__lang-item').removeClass('active');
            $('#eng').addClass('active');
            _ajaxChange('eng');
        });
        $('#rus').on('click', function(){
            $('#eng').removeClass('active');
            $('#rus').addClass('active');
            _ajaxChange('rus');
        });
    };

    // Функция смены языков
    var _ajaxChange = function (lang) {
        // Делаем AJAX запрос данных на сервер
        $.ajax({
                // Адрес обрабатывающего скрипты
                url: 'php/langChange.php',
                // Метод, которым отправляем данные
                type:'POST',
                // Тип отправляемых данных
                dataType: 'json',
                // Сами данные, которые преобразовываем в JSON строку
                data:'jsonLang=' + JSON.stringify(lang)
            })

            // При ошибке на сервере, выполняется данная функция
            .fail(function(langObj) {
                console.log('Проблемы в PHP');
            })

            // При успешном выполнении скрипта
            // выводим данные в блоки с текстом
            .done(function(langObj) {
                $('.image-view__title').text(langObj.titleContent);
                $('.saidbar__title').text(langObj.settings);
                $('#mainTitleText').text(langObj.inputMain);
                $('#fake').text(langObj.inputMainPlace);
                $('#waterTitleText').text(langObj.inputWater);
                $('#fakeWat').text(langObj.inputWaterPlace);
                $('.position__title').text(langObj.position);
                $('.opacity__title').text(langObj.opacity);
                $('.buttons__reset').text(langObj.butClear);
                $('.buttons__download').text(langObj.butDownload);
                $('.popup__title').text(langObj.helpTitle);
                $('#help1').text(langObj.help1);
                $('#help2').text(langObj.help2);
                $('#help3').text(langObj.help3);
                $('#help4').text(langObj.help4);
                $('#help5').text(langObj.help5);
                $('#help6').text(langObj.help6);
                $('.popup__copyright-title').text(langObj.helpDevelop);
                $('.sweet-alert h2').text(langObj.disTitle);
                $('.sweet-alert p').text(langObj.disBody);
                $('.sweet-alert .confirm').text(langObj.disBut);
            });
    };
    return {
        init: langInit
    }
}();

lang.init();

// -----------  Функция отвечающая за неактивные элементы -----------
var disableFuncs = function () {
    var disableInit = function () {
        _setupListners();
    };
    var _setupListners = function(){
        _disableFunc();
        _disableAlert();
    };

    var _disableFunc = function() {

        // При выборе первого файла, меняем закрывающий блок на меньший
        $('#fileupload').on('change', function() {
            $('.sidebar__disable').addClass('sidebar__disable_settings')
        });

        // При выборе второго файла, скрываем закрывающий блок
        $('#fileuploadWat').on('change', function() {
            $('.sidebar__disable').addClass('sidebar__disable_none')
        });
    };

    // Если кто-то все же предпримет попытку нажать на скрытые элементы
    // его ждет всплывающее сообщение 
    var _disableAlert = function() {
        $('.sidebar__disable').on('click', function() {
            swal({
                title: 'Вы забыли выбрать изображения',
                text: 'Для включения настроек изменения водяного знака сначала выберите необходимые вам изображения!',
                confirmButtonText: "Продолжить работу"
            });
        });
    };

    return {
        init: disableInit
    }
}();

disableFuncs.init();

// -----------  Функция попапа с описанием проекта -----------

var Popup = (function() {

    var popupInit = function() {
        _setUpListners();
    };

    var _setUpListners = function() {
        _popup();
    };

    // Функция настроки попапа
    var _popup = function() {

        // При нажатии на ссылку
        $('.icons__instuctions_link').on('click', function(e) {
            e.preventDefault();

            // Появляется Popup
            $('.popup').bPopup({
                positionStyle: 'fixed',
                closeClass : 'popup__exit_icon',
            });
        });
    };

    return {
        init: popupInit
    };

}());

Popup.init();

// -----------  Функция социального шаринга -----------

var SharingModule = (function() {
    var
        myUrl = document.location.href,
        title = document.title,
        desc = $('meta[name="description"]').attr('content'),
        fb = $('.icons__social-item_fb'),
        tw = $('.icons__social-item_tw'),
        vk = $('.icons__social-item_vk');

    var init = function(){
            _setupListners();
        };        

    var _setupListners = function(){
            fb.on('click', _fb);
            tw.on('click', _tw);
            vk.on('click', _vk);
        };

    var _fb = function(e) {
        console.log(fb);
        e.preventDefault();
    var url = 'http://www.facebook.com/sharer.php?s=100';
        url += '&p[title]=' + encodeURIComponent(title);
        url += '&p[summary]=' + encodeURIComponent(desc);
        url += '&p[url]=' + encodeURIComponent(myUrl);
        popup(url);
    };

    var _tw = function(e) {
        console.log(tw);
        e.preventDefault();
    var url = 'http://twitter.com/share?';
        url += 'text=' + encodeURIComponent(title);
        url += '&url=' + encodeURIComponent(myUrl);
        url += '&counturl=' + encodeURIComponent(url);
        popup(url);
    };
      
    var _vk = function(e) {
        e.preventDefault();
    var url = 'http://vk.com/share.php?';
        url += 'url=' + encodeURIComponent(myUrl);
        url += '&title=' + encodeURIComponent(title);
        url += '&description=' + encodeURIComponent(desc);
        url += '&noparse=true';
        popup(url);
    };

    function popup(url) {
        var sharingWidth = 650,
             sharingHeight = 450,
             marginLeft  = screen.availWidth / 2 - sharingWidth / 2,
             marginTop = screen.availHeight / 2 - sharingHeight / 2;
        window.open(url, '_blank', 'toolbar=0, status=0, width=650, height=450, left=' + marginLeft +', top=' + marginTop);
    }
    
    return {
       init: init
    };      
})();

SharingModule.init();

// -----------  Фунция сброса -----------

var ResetFunc = (function() {

    var resetInit = function() {
        _setUpListners();
    };

    var _setUpListners = function() {
       $('.buttons__reset').on('click', _resetFunc);
    };

    var _resetFunc = function() {
        // Приводим все значения в начальное состояние
        $('.image-view__water-img').css('left', 0),
        $('.image-view__water-img').css('top', 0),
        $('.image-view__water-img').css('opacity', 1),
        $('.position-right__input-top').spinner('value', 0),
        $('.position-right__input-bot').spinner('value', 0),
        $('.opacity__slider').slider("value", 1),
        $('.wrap-image-view__water-till-block').css('opacity', 1),

        // Сбрасываем отступы у замощаемой марки
        $('.image-view__water-till-img').css('padding-right', 15);
        $('.image-view__water-till-img').css('padding-bottom', 15);

        // Выставляем режим, как для режима замощения водяного знака
        $('.change-view__link_multi').trigger('click');

        // Выставляем водяной знак по центру
        centerLeft = $('.image-view__main-img').css('width').slice(0, -2) / 2  - $('.wrap-image-view__water-till-block').css('width').slice(0, -2) / 2;
        centerTop = $('.image-view__main-img').css('height').slice(0, -2) / 2  - $('.wrap-image-view__water-till-block').css('height').slice(0, -2) / 2;
        console.log($('.image-view__main-img').css('width').slice(0, -2));
        console.log($('.image-view__main-img').css('height').slice(0, -2));
        console.log($('.wrap-image-view__water-till-block').css('width').slice(0, -2));
        console.log($('.wrap-image-view__water-till-block').css('height').slice(0, -2));
        console.log(centerLeft);
        console.log(centerTop);
        $('.wrap-image-view__water-till-block').css('left', centerLeft);
        $('.wrap-image-view__water-till-block').css('top', centerTop);

        // Выставляем режим, как для одиночного водяного знака
        $('.change-view__link_normal').trigger('click');
    };

    return {
        init: resetInit
    };

}());

ResetFunc.init();


