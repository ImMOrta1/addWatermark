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
                    widthContainerImages = $('.image-view__container-main-image').css('width').slice(0, -2),
                    heightContainerImages = $('.image-view__container-main-image').css('height').slice(0, -2),
                    sourceWater = $('.image-view__water-img').attr('src');

                horizontalElems = Math.round(widthContainerImages / widthWater);
                horizontalElemsBlock = horizontalElems * 2;
                verticalElems = Math.round(heightContainerImages / heightWater);
                verticalElemsBlock = verticalElems * 2;

                widthElemsBlock = widthWater * (horizontalElemsBlock+2);
                heigthElemsBlock = heightWater * (verticalElemsBlock+2);

                $('.wrap-image-view__water-img').css('position', 'absolute');
                $('.wrap-image-view__water-img').css('top', '0');
                $('.wrap-image-view__water-img').css('left', '0');
                $('.wrap-image-view__water-img').css('right', '0');
                $('.wrap-image-view__water-img').css('bottom', '0');
                $('.wrap-image-view__water-img').css('margin', 'auto');
                $('.wrap-image-view__water-img').css('width', widthElemsBlock);
                $('.wrap-image-view__water-img').css('height', heigthElemsBlock);

                $('.image-view__container-main-image').css('overflow', 'hidden');



                for (i = 1; i < verticalElemsBlock; i++ ) {
                    for (j = 1; j < horizontalElemsBlock; j++ ) {
                        $('<img src="' + sourceWater + '" class="image-view__water-img">').appendTo(".wrap-image-view__water-img");
                    }
                    $('<br/>').appendTo(".wrap-image-view__water-img");
                }

                $('.image-view__water-img').css('position', 'static');
                $('.image-view__water-img').css('width', widthWater);
                $('.image-view__water-img').css('height', heightWater);
            }
        })
    }

//Tilling Block Function 
    var tilingBlock = function () {
        var widthWater = $('.image-view__water-img').attr('width'),
            heightWater = $('.image-view__water-img').attr('height'),
            widthContainerImages = $('.image-view__container-main-image').css('width'),
            heightContainerImages = $('.image-view__container-main-image').css('height'),
            sourceWater = $('.image-view__water-img').attr('src');

        console.log(widthWater);
        console.log(heightWater);
        console.log(widthContainerImages);
        console.log(heightContainerImages);


        horizontalElems = Math.round(widthContainerImages / widthWater);
        horizontalElemsBlock = horizontalElems + Math.round(horizontalElems / 2);
        verticalElems = Math.round(heightContainerImages / heightWater);
        verticalElemsBlock = verticalElems + Math.round(verticalElems / 2);
        console.log(horizontalElems);
        console.log(horizontalElemsBlock);
        console.log(verticalElems);
        console.log(verticalElemsBlock);

        for (i = 1; i < verticalElemsBlock; i++ ) {
            for (j = 1; i < horizontalElemsBlock; j++ ) {
                $('<img src="' + sourceWater + '" width=' + widthWater + ' height=' + heightWater + ' class="image-view__water-img">').appendTo(".wrap-image-view__water-img");
            }
            $('<br>').appendTo(".wrap-image-view__water-img");
        }
    };

//Возвращаем значения
	return {
		resizeMain: resizeMain,
		resizeWater: resizeWater,
        tilingBlock: tilingBlock
	}
})();

if (typeof console === "undefined" || typeof console.log === "undefined") {
     console = {};
     console.log = function() {};
	};
                
