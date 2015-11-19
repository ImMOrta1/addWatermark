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

        var inputImg = $(inputFile),
            inputImgContainer = inputImg.closest('.file-upload__container'),
            fakeTextUrl = inputImgContainer.find('.file-upload__inputInvis'),
            fileNameText = inputImgContainer.find('.file-upload__fake'),
            wrapContainer = $(container).closest('.image-view__container-main-image');

        $(inputFile).fileupload({

            // Папка где располагается PHP скрипт jQuery File Upload 
            url: 'php/upload.php',

            // Отправляем данные на сервер
            add: function(e, data) {
                data.submit();
                $('#progress').css(
                    'opacity', 1
                );
            },

            progress: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            },

            // В случае ошибки на сервере выводит сообщение в консоль
            fail:function(e, data, error){
                // ×òî-òî ïîøëî íå òàê!
                console.log(data);
                console.log(error);
            },

            // В случае успеха на сервере, выполняем эту функцию
            success: function(data) {
                    //Переводим данный из JSON строки в JS объект 
                    //и сохраняем URL в отдельную переменную
                var imgObj = $.parseJSON(data),
                    imgUrl = imgObj.url;

                    console.log(imgObj);

                //Записываем путь до файла на сервере в src элемента
                $(container).remove();

                // Изменение размера изображений
                if (container == '.image-view__main-img') {
                    $('<img src="php/' + imgUrl + '">').prependTo(wrapContainer).addClass(container.slice(1)).css('opacity', 0);
                    resizeImage.resizeMain(container);
                } 
                if (container == '.image-view__water-img') {
                    $('<img src="php/' + imgUrl + '">').appendTo(wrapContainer).addClass(container.slice(1)).css('opacity', 0);
                    resizeImage.resizeWater(container);
                    resizeImage.tillWater(container, imgUrl);
                } 

                //Сохраняем путь до файла на сервере в скрытый Input
                fakeTextUrl.val(imgUrl);

                $('#progress').css(
                    'opacity', 0
                );

                fileNameText.text(imgObj.name);

                // Отрезаем лишнюю часть пути, для вывода в fakeInput
                console.log('done');
            }

        });

    };


//Возвращаем значения
    return {
        init: init
    }
})();

if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function() {};
};


fileLoadToForm.init();