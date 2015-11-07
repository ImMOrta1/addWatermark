var fileLoadToForm = (function () {

// �������������
    var init = function () {
        _setUpListners();
    };

// ������������� �������
    var _setUpListners = function () {
        _fileUploadFunc('#fileupload','.image-view__main-img ');
        _fileUploadFunc('#fileuploadWat','.image-view__water-img');
    };

//�������� ������ �� ������ jQueri File Upload
    var _fileUploadFunc = function (inputFile,container) {

        var inputImg = $(inputFile),
            inputImgContainer = inputImg.closest('.file-upload__container'),
            fakeTextUrl = inputImgContainer.find('.file-upload__inputInvis'),
            fileNameText = inputImgContainer.find('.file-upload__fake');

        $(inputFile).fileupload({

            // ����� ��� ������������� PHP ������ jQuery File Upload
            url: 'php/',

            // ���������� ������ �� ������
            add: function(e, data) {
                data.submit();
            },

            // � ������ ������ �� ������� ������� ��������� � �������
            fail:function(e, data, error){
                // ���-�� ����� �� ���!
                console.log(data);
                console.log(error);
            },

            // � ������ ������ �� �������, ��������� ��� �������
            done: function(e, data) {
                //��������� ������ �� JSON ������ � JS ������
                //� ��������� URL � ��������� ����������
                var imgObj = JSON.parse(data.result),
                    imgUrl = imgObj.files[0].url;

                //���������� ���� �� ����� �� ������� � background-image ��������
                $(container).css('background-image', 'url(' + imgUrl + ')');

                //��������� ���� �� ����� �� ������� � ������� Input
                fakeTextUrl.val(imgUrl);

                // �������� ������ ����� ����, ��� ������ � fakeInput
                fileName = imgUrl.replace(/.+[\\\/]/, "");
                fileNameText.text(fileName);
                console.log('done');
            }

        });

    };

//���������� ��������
    return {
        init: init
    }
})();

if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function() {};
};

fileLoadToForm.init();