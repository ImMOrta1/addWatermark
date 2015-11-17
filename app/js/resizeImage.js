var resizeImage = (function () {

//Resize main Image
    var resizeMain = function (image) {
        $(image).load(function() {


            var $this = $(this),
                widthMainNatural = $this.width(),
                heightMainNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image');
            q = ImgContainer.attr('data-ratio');

            ImgContainer.attr('data-width', widthMainNatural);
            ImgContainer.attr('data-height', heightMainNatural);

            if (widthMainNatural > heightMainNatural) {
                if (widthMainNatural > 650) {
                    q = widthMainNatural / 650;
                    ImgContainer.attr('data-ratio', q);
                    $this.width('650');

                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                } else {
                    if (heightMainNatural > 530) {
                        q = heightMainNatural / 530;
                        ImgContainer.attr('data-ratio', q);
                        $this.height('530');

                        var widthContainer = $this.width(),
                            heightContainer = $this.height();

                        ImgContainer.css("width", widthContainer);
                        ImgContainer.css("height", heightContainer);
                    } else {
                        q = 0;
                        ImgContainer.attr('data-ratio', q);

                        var widthContainer = $this.width(),
                            heightContainer = $this.height();

                        ImgContainer.css("width", widthContainer);
                        ImgContainer.css("height", heightContainer);
                    }
                }
            } else {
                if (heightMainNatural > 530) {
                    q = heightMainNatural / 530;
                    ImgContainer.attr('data-ratio', q);
                    $this.height('530');

                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                } else {
                    q = 0;
                    ImgContainer.attr('data-ratio', q);

                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                }
            }

            $this.stop().animate({opacity:'1.0'},300);
            $('.change-view__link_normal').trigger('click');
        })
    }

//Resize water Image
    var resizeWater = function (image) {
        $(image).load(function() {

            var $this = $(this);
                widthWaterNatural = $this.width(),
                heightWaterNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio'),
                widthMainNatural = ImgContainer.attr('data-width'),
                heightMainNatural = ImgContainer.attr('data-height');

            $this.attr('data-width', widthWaterNatural);
            $this.attr('data-height', heightWaterNatural);

            if (widthWaterNatural > widthMainNatural) {
                $this.width(widthMainNatural);
                widthWaterNatural = $this.width();
                heightWaterNatural = $this.height();
            }
            if (heightWaterNatural > heightMainNatural) {
                $this.height(heightMainNatural);
                widthWaterNatural = $this.width();
                heightWaterNatural = $this.height();
            }

            if (!(q == 0)) {
                var widthWater = widthWaterNatural / q,
                    heightWater = heightWaterNatural / q;

                $this.width(widthWater);
                $this.height(heightWater);
                $this.addClass('ui-draggable ui-draggable-handle')
            }

            $this.stop().css('opacity', 1);
            $('.change-view__link_normal').trigger('click');
        })
    }

// Tilling Water Image
    var tillWater = function (image, url) {
        $(image).load(function() {

            $('.wrap-image-view__water-till-block').remove();
            $('<div data-x-elem=0 data-y-elem=0>').appendTo(ImgContainer).addClass('wrap-image-view__water-till-block');

            var $this = $(this);
                widthWater = $this.width(),
                heightWater = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio'),
                tillBlock = $('.wrap-image-view__water-till-block');

            widthContainerImages = ImgContainer.css('width').slice(0, -2);
            heightContainerImages = ImgContainer.css('height').slice(0, -2);

            horizontalElems = Math.floor( ImgContainer.attr('data-width') / $this.attr('data-width') );
            horizontalElemsBlock = horizontalElems * 2;
            tillBlock.attr('data-x-elem', horizontalElemsBlock);
            verticalElems = Math.floor(ImgContainer.attr('data-height') / $this.attr('data-height'));
            verticalElemsBlock = verticalElems * 2;
            tillBlock.attr('data-y-elem', verticalElemsBlock);
            widthElemsBlock = (widthWater+15) * horizontalElemsBlock;
            heightElemsBlock = (heightWater+15) * verticalElemsBlock;

            tillBlock.css('width', widthElemsBlock);
            tillBlock.css('height', heightElemsBlock);

            for (i = 1; i < verticalElemsBlock+1; i++ ) {
                for (j = 1; j < horizontalElemsBlock+1; j++ ) {
                    $('<img src="' + url + '" class="image-view__water-till-img">').appendTo(tillBlock);
                }
                $('<br/>').appendTo(tillBlock);
            }

            $('.image-view__water-till-img').attr('width', widthWater);
            $('.image-view__water-till-img').attr('height', heightWater);
            $('.image-view__water-till-img').css('padding-right', 15);
            $('.image-view__water-till-img').css('padding-bottom', 15);

            centerLeft = widthContainerImages / 2  - widthElemsBlock / 2;
            centerTop = heightContainerImages / 2  - heightElemsBlock / 2;
            tillBlock.css('left', centerLeft);
            tillBlock.css('top', centerTop);
        })
    }

//Возвращаем значения
    return {
        resizeMain: resizeMain,
        resizeWater: resizeWater,
        tillWater: tillWater
    }
})();

if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function() {};
};
                
