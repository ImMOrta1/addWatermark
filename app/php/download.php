<?php

	$file_url = $_GET['url'];

	$file_array = explode('/', $file_url);
	$file_name = end($file_array);

	header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.$file_name);
    header('Content-Length: '.filesize($file_name));
    readfile($file_url);

?>