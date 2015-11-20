var resizeImage = (function () {

// Фукнция изменения размера главног изображения
    var resizeMain = function (image) {
        // Как только изображение загрузилось
        $(image).load(function() {

            //Определяем данные, с которыми будем работать
            var $this = $(this),
                widthMainNatural = $this.width(),
                heightMainNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),

                // q - коэффициент того, во сколько раз основное изображение
                // больше блока, в которые его помещают
                // Этот коэффициент используется для масштабирования водяного знака
                q = ImgContainer.attr('data-ratio');

            // Запоминаем в дата-атрибутах исходные значения изображений
            ImgContainer.attr('data-width', widthMainNatural);
            ImgContainer.attr('data-height', heightMainNatural);

            // Если у изображения горизонтальная ориентация
            if (widthMainNatural > heightMainNatural) {
                // Выясняем больше ли она ширины нашего блока
                if (widthMainNatural > 650) {
                    // если больше, то вычисляем коэффициент того, во сколько раз больше
                    q = widthMainNatural / 650;
                    ImgContainer.attr('data-ratio', q);

                    // Проверяем, а не больше ли итоговая высота картики, 
                    // высоты блока
                    if (heightMainNatural / q > 530) {
                        // Если да, то вычисляем по новой коэффициент уже относительно высоты
                        q = heightMainNatural / 530;
                        ImgContainer.attr('data-ratio', q);
                        //Формируем картинку исходя из высоты блока
                        $this.height('530');
                    } else {
                        //Формируем картинку исходя из ширины блока
                        $this.width('650');
                    }

                    // Задаем размеры контейнеру с изображением
                    // взяв их из автоматически получившихся размеров картинки
                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                } else {
                    // Если же ширина картинки меньше ширины блока, 
                    // проверяем, а не больше ли высота картики, высоты блока
                    if (heightMainNatural > 530) {
                        // если больше, то вычисляем коэффициент того, во сколько раз больше
                        q = heightMainNatural / 530;
                        ImgContainer.attr('data-ratio', q);
                        //Формируем картинку исходя из высоты блока
                        $this.height('530');

                        // Задаем размеры контейнеру с изображением
                        // взяв их из автоматически получившихся размеров картинки
                        var widthContainer = $this.width(),
                            heightContainer = $this.height();

                        ImgContainer.css("width", widthContainer);
                        ImgContainer.css("height", heightContainer);
                    } else {
                        // Если же и высота не больше, то коэффициент равен 0,
                        // а картинка помещается в исходных размерах
                        q = 0;
                        ImgContainer.attr('data-ratio', q);

                        // Задаем размеры контейнеру с изображением
                        // взяв их из размеров изображения
                        var widthContainer = $this.width(),
                            heightContainer = $this.height();

                        ImgContainer.css("width", widthContainer);
                        ImgContainer.css("height", heightContainer);
                    }
                }
            } else {
                // Если нет, то изображение вертикальной ориентации 
                // Проверяем, а не больше ли высота картики, высоты блока
                if (heightMainNatural > 530) {
                    // если больше, то вычисляем коэффициент того, во сколько раз больше
                    q = heightMainNatural / 530;
                    ImgContainer.attr('data-ratio', q);
                    //Формируем картинку исходя из высоты блока
                    $this.height('530');

                    // Задаем размеры контейнеру с изображением
                    // взяв их из автоматически получившихся размеров картинки
                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                } else {
                    // Если же и высота не больше, то коэффициент равен 0,
                    // а картинка помещается в исходных размерах
                    q = 0;
                    ImgContainer.attr('data-ratio', q);

                    // Задаем размеры контейнеру с изображением
                    // взяв их из размеров изображения
                    var widthContainer = $this.width(),
                        heightContainer = $this.height();

                    ImgContainer.css("width", widthContainer);
                    ImgContainer.css("height", heightContainer);
                }
            }

            // Плавно проявляем итоговое изображение на странице
            $this.stop().animate({opacity:'1.0'},300);

            // Выставляем начальный режим, как для одиночного водяного знака
            $('.change-view__link_normal').trigger('click');
        })
    }

// Функция изменения изображения водяного знака
    var resizeWater = function (image) {
        // Как только изображение загрузилось
        $(image).load(function() {

            //Определяем данные, с которыми будем работать
            var $this = $(this);
                widthWaterNatural = $this.width(),
                heightWaterNatural = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                // q - коэффициент того, во сколько раз основное изображение
                // больше блока, в которые его помещают
                q = ImgContainer.attr('data-ratio'),
                widthMainNatural = ImgContainer.attr('data-width'),
                heightMainNatural = ImgContainer.attr('data-height');

            // Заносим исходные размеры ширины и высоты водяного знака
            // в дата-атрибуты
            $this.attr('data-width', widthWaterNatural);
            $this.attr('data-height', heightWaterNatural);

            // Проверяем, а не больше ли наш водяной знак, чем 
            // основная картинка по ширине
            if (widthWaterNatural > widthMainNatural) {
                // Если да, то уменьшаем водяной знак согласно ширине основного изображения
                $this.width(widthMainNatural);
                widthWaterNatural = $this.width();
                heightWaterNatural = $this.height();
            }
            // А потом проверяем по высоте
            if (heightWaterNatural > heightMainNatural) {
                // Если да, то уменьшаем водяной знак согласно высоты основного изображения
                $this.height(heightMainNatural);
                widthWaterNatural = $this.width();
                heightWaterNatural = $this.height();
            }

            // Если коэффициент не равен 0, то выполняем масштабирование водяного знака
            if (!(q == 0)) {
                // Вычисляем новые размеры
                var widthWater = widthWaterNatural / q,
                    heightWater = heightWaterNatural / q;

                // Заносим новые размеры 
                $this.width(widthWater);
                $this.height(heightWater)
            }

            // Показываем элемент на странице,
            // Изначально оно скрыто, для того, чтобы оно не дергалось при загрузке
            $this.css('opacity', 1);

            // Выставляем начальный режим, как для одиночного водяного знака
            $('.change-view__link_normal').trigger('click');
        })
    }

// Функция создания блока с замощенным водянным знаком
    var tillWater = function (image, url) {
        // Как только изображение загрузилось
        $(image).load(function() {

            // Удаляем прошлый блок, если такой был
            $('.wrap-image-view__water-till-block').remove();
            // Добавляем новый, пустой
            $('<div data-x-elem=0 data-y-elem=0>').appendTo(ImgContainer).addClass('wrap-image-view__water-till-block');

            //Определяем данные, с которыми будем работать
            var $this = $(this);
                widthWater = $this.width(),
                heightWater = $this.height(),
                ImgContainer = $this.closest('.image-view__container-main-image'),
                // q - коэффициент того, во сколько раз основное изображение
                // больше блока, в которые его помещают
                q = ImgContainer.attr('data-ratio'),
                tillBlock = $('.wrap-image-view__water-till-block'),
                widthContainerImages = ImgContainer.css('width').slice(0, -2),
                heightContainerImages = ImgContainer.css('height').slice(0, -2);

            // Вычисляем сколько водяных знаков поместится в основном изображении по горизонтали
            horizontalElems = Math.floor( ImgContainer.attr('data-width') / $this.attr('data-width') );
            // В итоге будем формировать поле с в 2 раза больших кол-вом элементов
            horizontalElemsBlock = horizontalElems * 2;
            // Заносим в дата-аттрибут это значение
            tillBlock.attr('data-x-elem', horizontalElemsBlock);
            // Вычисляем сколько водяных знаков поместится в основном изображении по вертикали
            verticalElems = Math.floor(ImgContainer.attr('data-height') / $this.attr('data-height'));
            // В итоге будем формировать поле с в 2 раза больших кол-вом элементов
            verticalElemsBlock = verticalElems * 2;
            // Заносим в дата-аттрибут это значение
            tillBlock.attr('data-y-elem', verticalElemsBlock);
            // Формируем размеры блока исходя из итогового кол-ва элементов * на их ширину
            // + начальные отступы равные 15
            widthElemsBlock = (widthWater+15) * horizontalElemsBlock;
            heightElemsBlock = (heightWater+15) * verticalElemsBlock;

            tillBlock.css('width', widthElemsBlock);
            tillBlock.css('height', heightElemsBlock);

            // Начинаем заполнять блок элементами
            // цикл по строкам
            for (i = 1; i < verticalElemsBlock+1; i++ ) {
                // цикл по столбцам
                for (j = 1; j < horizontalElemsBlock+1; j++ ) {
                    // Вставляем водяной знак
                    $('<img src="' + url + '" class="image-view__water-till-img">').appendTo(tillBlock);
                }
                // Как только строка закончилась переходим на новую
                $('<br/>').appendTo(tillBlock);
            }

            // Оформляем стили картинок, входящих в блок замощения
            $('.image-view__water-till-img').attr('width', widthWater);
            $('.image-view__water-till-img').attr('height', heightWater);
            $('.image-view__water-till-img').css('padding-right', 15);
            $('.image-view__water-till-img').css('padding-bottom', 15);

            // Позиционируем блок так, чтобы его центр, был в центре холста
            centerLeft = widthContainerImages / 2  - widthElemsBlock / 2;
            centerTop = heightContainerImages / 2  - heightElemsBlock / 2;
            tillBlock.css('left', centerLeft);
            tillBlock.css('top', centerTop);
        })
    }

//Возвращаем методы, которыми можем вызывать эти функции
    return {
        resizeMain: resizeMain,
        resizeWater: resizeWater,
        tillWater: tillWater
    }
})();
                
