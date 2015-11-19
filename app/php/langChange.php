<?php
  
      // Расшифровываем пришедшую JSON строку
  		$lang = json_decode($_POST['jsonLang']);

      // Создаем массим вывода данных
      $data = array();

      // В зависимости от выбранного языка, передаем в выходной массив данных
      // свои значения
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
        $data['helpTitle'] = 'Как пользоваться приложением';
        $data['help1'] = 'Выберите и загрузите рисунок с помощью первого поля выбора файла';
        $data['help2'] = 'Выберите и загрузите рисунок вотермарка с помощью второго поля выбора файла';
        $data['help3'] = 'После выбора файлов основного рисунка и вотермарка станут доступны различные настройки';
        $data['help4'] = 'Используйте настройки манипуляции вотермарка';
        $data['help5'] = 'Если вас не устраивают настройки вотермарка нажмите кнопку "Сброс"';
        $data['help6'] = 'Для сохранения результата нажмите кнопку "Скачать"';
        $data['helpDevelop'] = 'Разработчики проекта';
        $data['disTitle'] = 'Вы забыли выбрать изображения';
        $data['disBody'] = 'Для включения настроек изменения водяного знака сначала выберите необходимые вам изображения!';
        $data['disBut'] = 'Продолжить работу';
      }if ($lang == 'eng') {
        $data['titleContent'] = 'Watermarks generator';
        $data['settings'] = 'Settings';
        $data['inputMain'] = 'Original image';
        $data['inputMainPlace'] = 'Image.jpg';
        $data['inputWater'] = 'Watermark';
        $data['inputWaterPlace'] = 'Image.png';
        $data['position'] = 'Place';
        $data['opacity'] = 'Transparency';
        $data['butClear'] = 'Reset';
        $data['butDownload'] = 'Download';
        $data['helpTitle'] = 'How to use the application';
        $data['help1'] = 'Choose source image and upload it into the "Original image" field';
        $data['help2'] = 'Choose source watermark image and upload it into the "Watermark image" field';
        $data['help3'] = 'Options "Place" and "Transparency" will be able after ulpload both images';
        $data['help4'] = 'Use options "Place" and "Transparency" to manipulate the watermark';
        $data['help5'] = "Reset watermark's settings by pressing 'Reset' button";
        $data['help6'] = "Download the result by pressing 'Download' button";
        $data['helpDevelop'] = "Developer's team";
        $data['disTitle'] = 'Вы забыли выбрать изображения';
        $data['disBody'] = 'Для включения настроек изменения водяного знака сначала выберите необходимые вам изображения!';
        $data['disBut'] = 'Продолжить работу';
      }
    
    // Выводим данные
    header("Content-Type: application/json");
    echo json_encode($data);
  exit;
?>