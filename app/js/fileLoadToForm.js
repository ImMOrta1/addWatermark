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

//Загрузка файлов на сервер jQueri File Upload
    var _fileUploadFunc = function (inputFile,container) {

        var inputImg = $(inputFile),
            inputImgContainer = inputImg.closest('.file-upload__container'),
            fakeTextUrl = inputImgContainer.find('.file-upload__inputInvis'),
            fileNameText = inputImgContainer.find('.file-upload__fake');

        $(inputFile).fileupload({

            // Папка где располагается PHP скрипт jQuery File Upload
            url: 'php/',

            // Отправляем данные на сервер
            add: function(e, data) {
                data.submit();
            },

            // В случае ошибки на сервере выводит сообщение в консоль
            fail:function(e, data, error){
                // Что-то пошло не так!
                console.log(data);
                console.log(error);
            },

            // В случае успеха на сервере, выполняем эту функцию
            done: function(e, data) {
                //Переводим данный из JSON строки в JS объект
                //и сохраняем URL в отдельную переменную
                var imgObj = JSON.parse(data.result),
                    imgUrl = imgObj.files[0].url;

                //Записываем путь до файла на сервере в background-image элемента
                $(container).css('background-image', 'url(' + imgUrl + ')');

                //Сохраняем путь до файла на сервере в скрытый Input
                fakeTextUrl.val(imgUrl);

                // Отрезаем лишнию часть пути, для вывода в fakeInput
                fileName = imgUrl.replace(/.+[\\\/]/, "");
                fileNameText.text(fileName);
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