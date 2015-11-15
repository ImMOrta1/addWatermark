<?php
  		$lang = json_decode($_POST['jsonLang']);

  		if ($lang == 'rus') {
  			$data['titleContent'] = 'Генератор водяных знаков';
  			$data['settings'] = 'Настройки';
  			$data['inputMain'] = 'Исходное изображение';
  			$data['inputMainPlace'] = 'выберите рисунок';
  			$data['inputWater'] = 'Водяной знак';
  			$data['inputWaterPlace'] = 'выберите водяной знак';
  			$data['position'] = 'Положение';
  			$data['opacity'] = 'Прозрачность';
  			$data['butClear'] = 'Сброс';
  			$data['butDownload'] = 'Скачать';
  		}if ($lang == 'eng') {
  			$data['titleContent'] = 'Watermarks generator';
  			$data['settings'] = 'Settings';
  			$data['inputMain'] = 'Originam image';
  			$data['inputMainPlace'] = 'Image.jpg';
  			$data['inputWater'] = 'Watermark';
  			$data['inputWaterPlace'] = 'Image.png';
  			$data['position'] = 'Place';
  			$data['opacity'] = 'Transparency';
  			$data['butClear'] = 'Reset';
  			$data['butDownload'] = 'Download';
  		}
  		
		header("Content-Type: application/json");
		echo json_encode($data);
  exit;
?>