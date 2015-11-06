
var Unity = (function () {
    function _setUpListeners() {
        $('#file-upload').fileupload({
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,

            add: function(e, data) {
                data.submit();
                console.log('upload');
            },
            done: function(e, data) {
                var uploadImg = data.result.files[0].name;
            }

        })
    };

    return {
        init: function () {
            _setUpListeners();
        }
    }


})();

Unity.init();