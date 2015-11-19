var fileLoadToForm = (function () {

// Инициализация
    var init = function () {
        _setUpListners();
    };

// Прослушивание событий
    var _setUpListners = function () {
        _fileUploadFunc('#fileupload','.image-view__main-img');
        _fileUploadFunc('#fileuploadWat','.image-view__water-img');
    };

//Загрузка файлов на сервер jQuery File Upload
    var _fileUploadFunc = function (inputFile,container) {

        // Определяем элементы, с которыми будем работать
        var inputImg = $(inputFile),
            inputImgContainer = inputImg.closest('.file-upload__label'),
            fakeTextUrl = inputImgContainer.find('.file-upload__inputInvis'),
            fileNameText = inputImgContainer.find('.file-upload__fake'),
            progressWrap = inputImgContainer.find('#progress'),
            progressBar = inputImgContainer.find('.progress-bar'),
            wrapContainer = $(container).closest('.image-view__container-main-image');

        //Инициализируем FileUpload
        $(inputFile).fileupload({

            // Папка где располагается PHP скрипт jQuery File Upload 
            url: 'php/upload.php',

            // Функция, выполняющаяся при отправке данных на сервер
            add: function(e, data) {
                data.submit();
                
                // Показываем прогресс-бар загрузки файлов
                progressWrap.css(
                    'opacity', 1
                );
            },

            // Функция, выполняющаяся во время загрузки файла на сервер
            progress: function(e, data) {
                // Прогресс-бар заполняется по мере загрузки файла
                var progress = parseInt(data.loaded / data.total * 100, 10);
                progressBar.css(
                    'width',
                    progress + '%'
                );
            },

            // В случае успеха на сервере, выполняем эту функцию
            success: function(data) {
                //Переводим данный из JSON строки в JS объект 
                //и сохраняем URL в отдельную переменную
                var imgObj = $.parseJSON(data),
                    imgUrl = 'php/' + imgObj.url;

                // Записываем путь до файла на сервере в src элемента
                $(container).remove();

                // Если это главная картинка, добавляем её на страницу и выполняем функцию изменения размера под блок
                if (container == '.image-view__main-img') {
                    $('<img src="' + imgUrl + '">').prependTo(wrapContainer).addClass(container.slice(1)).css('opacity', 0);
                    resizeImage.resizeMain(container);
                } 
                // Если это водяной знак, добавляем его на страницу, изменяем размер относительно главной картинки
                // и создаем блок с замощенным водяным знаком
                if (container == '.image-view__water-img') {
                    $('<img src="' + imgUrl + '">').appendTo(wrapContainer).addClass(container.slice(1)).css('opacity', 0);
                    resizeImage.resizeWater(container);
                    resizeImage.tillWater(container, imgUrl);
                } 

                // Сохраняем путь до файла на сервере в скрытый Input
                fakeTextUrl.val(imgObj.url);

                // Скрываем прогресс-бар
                progressWrap.css(
                    'opacity', 0
                );

                // Выводим имя загруженного файла
                fileNameText.text(imgObj.name);

                console.log('done');
            }
        });
    };

    return {
        init: init
    }
})();

fileLoadToForm.init();