var fileUploadToServer = (function () {


// Инициализация
	var init = function () {
		_setUpListners();
	};

// Прослушивание событий
	var _setUpListners = function () {
		$('#upload').on('submit', _addProject);
	};

//Добавление проекта
	var _addProject = function (event) {
		event.preventDefault();

		var ajaxPOST = {
			urlMain: $('#mainFileText').val(),
			urlWater: $('#waterFileText').val(),
			opacity: $('.opacity__input-invis').val(),
			posX: $('.image-view__water-img').css('left').slice(0, -2),
			posY: $('.image-view__water-img').css('top').slice(0, -2),
		};

		console.log(ajaxPOST);

		var url = 'php/compileImg.php',
			defObj = _ajaxForm(ajaxPOST,url);

		//Если JS валидация успешна, то Ajax запрос на сервер
		if (defObj) {
			defObj.done(function(ans) {
				if (ans.status ==='OK') {
					console.log(ans.text);
					document.location = 'php/' + ans.url;
				} else {
					console.log(ans.text);
				}
			})
		}

	};
//Универсальня функция
// Для ее работы используется
// @form - форма
// @url - адрес php файла к которому мы обращаемся
// 1. Собирает данные из формы
//2. Проверяет форму
// 3. Делает запрос на сервер и возвращает ответ с сервера
	var _ajaxForm = function (formData, url) {

		var result = $.ajax({
				url: url,
				type:'POST',
				dataType: 'json',
            	data:'jsonData=' + JSON.stringify(formData)
				})
				.fail(function(ans) {
					console.log('Проблемы в PHP');
				});

		return result;
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


fileUploadToServer.init();