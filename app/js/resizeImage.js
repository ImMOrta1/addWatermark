var resizeImage = (function () {

//Resize main Image
	var resizeMain = function (image) {
        $(image).load(function() {


            var $this = $(this),
                widthMainNatural = $this.width(),
                heigthMainNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio');

            if (widthMainNatural > heigthMainNatural) {
                if (widthMainNatural > 650) {
                    q = widthMainNatural / 650;
                    ImgContainer.attr('data-ratio', q);
                    $this.width('650');

                    var widthContainer = $this.width(),
                        heigthContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heigthContainer);
                } else {
                    q = 0;
                    ImgContainer.attr('data-ratio', q);

                    var widthContainer = $this.width(),
                        heigthContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heigthContainer);
                }
            } else {
                if (heigthMainNatural > 530) {
                    q = heigthMainNatural / 530;
                    ImgContainer.attr('data-ratio', q);
                    $this.height('530');

                    var widthContainer = $this.width(),
                        heigthContainer = $this.height();

                    console.log(widthContainer);

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heigthContainer);
                } else {
                    q = 0;
                    ImgContainer.attr('data-ratio', q);

                    var widthContainer = $this.width(),
                        heigthContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heigthContainer);
                }
            }
        })
    }

//Resize water Image
    var resizeWater = function (image) {
        $(image).load(function() {

            var $this = $(this);
                widthWaterNatural = $this.width(),
                heigthWaterNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                q = ImgContainer.attr('data-ratio');

            if (!(q == 0)) {
                var widthWater = widthWaterNatural / q,
                    heightWater = heigthWaterNatural / q;

                    $this.width(widthWater);
                    $this.height(heightWater);
            }
        })
    }

// Tilling Water Image
    var tillWater = function (image, url) {
        $(image).load(function() {

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
            heigthElemsBlock = heightWater * verticalElemsBlock;

            tillBlock.css('width', widthElemsBlock);
            tillBlock.css('height', heigthElemsBlock);

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
                
