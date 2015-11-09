<?php

	$file1 = $_FILES['img_sourse'];
	$file2 = $_FILES['img_water'];

	$file1_name = $file1['name'];
	$file2_name = $file2['name'];
	$data = array();


    if(!file_exists(__DIR__.'/uploads/')){
        mkdir(__DIR__.'/uploads/', 777);
    }

    $file1_dist = __DIR__.'/uploads/'.$file1_name;
    $file2_dist = __DIR__.'/uploads/'.$file2_name;

    move_uploaded_file($file1['tmp_name'], $file1_dist);
    move_uploaded_file($file2['tmp_name'], $file2_dist);

	if ($name === '') {
		$data['status'] = 'ERROR!';
		$data['text'] = 'Заполните имя!';
	} else {
		$data['status'] = 'OK';
		$data['text1'] = $file1_name;
		$data['text2'] = $file2_name;
	}
	
	header("Content-Type: application/json");
	echo json_encode($data);
	exit;

?>