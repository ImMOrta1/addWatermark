var Unity = (function() {



    var sliderInit = function() {
        _setupListners();

    };

    var _setupListners = function() {
        _opacity();
        $('#fileupload').on('change', _uploadInfo);
        //$('#fileuploadWat').on('change', _uploadInfoWat);
        ////$('#fileupload').fileupload({
        ////        acceptFileTypes: /(\.|\/)(jpg)$/i
        ////    })
        ////    .bind('fileuploadadded', function (e, data) {
        ////        console.log(data.files.valid);
        ////    });
        //$('#fileupload').fileupload({
        //    dataType: 'json',
        //    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        //    url: 'php/',
        //
        //    add: function(e, data) {
        //        data.submit();
        //        console.log('upload');
        //    },
        //    done: function(e, data) {
        //        var uploadImg = data.result.files[0].name;
        //    }
        //
        //})
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


    var _opacity = function() {
        $('.opacity__slider').slider({
            range: 'min',
            min: 0, 
            max: 1, 
            step: 0.01, 
            value: 1,
            slide: function( event, ui ) {
                 $('.image-view__watermark').css('opacity', ui.value)
            }
        });
    };

    return {
        init: sliderInit
    };

}());

Unity.init();