var modulelLoad = (function () {

// Инициализация
	var init = function () {
		_setUpListners();
	};

// Прослушивание событий
	var _setUpListners = function () {
		$('#upload').on('submit', _addProject);
		_fileUploadFunc('#mainFileInput','.image-view__container');
		_fileUploadFunc('#waterFileInput','.image-view__container');
	};

//Добавление проекта
	var _addProject = function (event) {
		event.preventDefault();

		var form = $(this),
			url = 'add_project.php',
			defObj = _ajaxForm(form,url);

		//Если JS валидация успешна, то Ajax запрос на сервер
		if (defObj) {
			defObj.done(function(ans) {
				if (ans.status ==='OK') {
					console.log(ans.text1);
					console.log(ans.text2);
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

//Загрузка файлов на сервер jQueri File Upload
	var _fileUploadFunc = function (inputFile,container) {
			$(inputFile).fileupload({

		        url: 'php/',

		        add: function(e, data) {

		        	console.log('add');
		        	console.log(data);
		        	data.submit();
		        }, 

		        fail:function(e, data, error){
		            // Что-то пошло не так!
		            console.log(data);
		            console.log(error);
		        },

		        done: function(e, data) {
		        	console.log(data.result);
		        	JSON.parse(data.result);
					console.log( JSON.parse(data.result) );

					var bla = JSON.parse(data.result);

					console.log(bla);
		        	console.log(bla.files[0].url);

					$(container).css('background-image', 'url(' + bla.files[0].url + ')');


		        	console.log('done');
		        }

	    	});

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
	
modulelLoad.init();