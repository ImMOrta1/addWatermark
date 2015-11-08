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

		var form = $(this),
			url = 'php/compileImg.php',
			defObj = _ajaxForm(form,url);

		//Если JS валидация успешна, то Ajax запрос на сервер
		if (defObj) {
			defObj.done(function(ans) {
				if (ans.status ==='OK') {
					console.log(ans.text);
					document.location = 'php/' + ans.fileName;
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
	var _ajaxForm = function (form, url) {

		data = form.serialize();

		var result = $.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data
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