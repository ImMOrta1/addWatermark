var fileUploadToServer = (function () {

	var urlServer = 'php/compileImg.php';

// Инициализация
	var init = function () {
		_setUpListners();
	};

// Прослушивание событий
	var _setUpListners = function () {
		$('#upload').on('submit', _ajaxServer);
	};

// Download JSON to Server and redirect to Image Link
	var _ajaxServer = function (event) {
		event.preventDefault();

		var ajaxPOST = {
				urlMain: $('#mainFileText').val(),
				urlWater: $('#waterFileText').val(),
				opacity: $('.opacity__input-invis').val(),
				posX: $('.image-view__water-img').css('left').slice(0, -2),
				posY: $('.image-view__water-img').css('top').slice(0, -2),
			};

		var result = $.ajax({
				url: urlServer,
				type:'POST',
				dataType: 'json',
            	data:'jsonData=' + JSON.stringify(ajaxPOST)
				})
				.fail(function(ans) {
					console.log('Проблемы в PHP');
				})
				.done(function(ans) {
					if (ans.status ==='OK') {
						console.log(ans.text);
						document.location = 'php/' + ans.url;
					} else {
						console.log(ans.text);
					}
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