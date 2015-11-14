var resizeImage = (function () {

//Resize main Image
	var resizeMain = function (image) {
        $(image).load(function() {


            var $this = $(this),
                widthMainNatural = $this.width(),
                heightMainNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio');

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
        })
    }

//Resize water Image
    var resizeWater = function (image) {
        $(image).load(function() {

            var $this = $(this);
                widthWaterNatural = $this.width(),
                heightWaterNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio');

            if (!(q == 0)) {
                var widthWater = widthWaterNatural / q,
                    heightWater = heightWaterNatural / q;

                    $this.width(widthWater);
                    $this.height(heightWater);
                    $this.addClass('ui-draggable ui-draggable-handle')
            }

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


            horizontalElems = Math.round(widthContainerImages / widthWater);
            horizontalElemsBlock = horizontalElems * 2;
            tillBlock.attr('data-x-elem', horizontalElemsBlock);
            verticalElems = Math.round(heightContainerImages / heightWater);
            verticalElemsBlock = verticalElems * 2;
            tillBlock.attr('data-y-elem', verticalElemsBlock);

            widthElemsBlock = widthWater * horizontalElemsBlock;
            heightElemsBlock = heightWater * verticalElemsBlock;

            tillBlock.css('width', widthElemsBlock);
            tillBlock.css('height', heightElemsBlock);

            for (i = 1; i < verticalElemsBlock; i++ ) {
                for (j = 1; j < horizontalElemsBlock; j++ ) {
                    $('<img src="' + url + '" class="image-view__water-till-img">').appendTo(tillBlock);
                }
                $('<br/>').appendTo(tillBlock);
            }

            $('.image-view__water-till-img').attr('width', widthWater);
            $('.image-view__water-till-img').attr('height', heightWater);
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
                
