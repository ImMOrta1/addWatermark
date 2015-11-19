<?php

    // Получаем данные из GET запроса
	$file_url = $_GET['url'];

    // Запоминаем необходимые пути к файлу
	$file_array = explode('/', $file_url);
	$file_name = end($file_array);

    // Выводим файла
	header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.$file_url);
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: '.filesize($file_url));
    readfile($file_url);

    exit;
?>