<?php

	class watermark3{
	 
		function create_watermark( $main_img_obj, $watermark_img_obj, $water_position_x, $water_position_y, $alpha_level = 100 ) {
			$alpha_level	/= 100;	

			$main_img_obj_w	= imagesx( $main_img_obj );
			$main_img_obj_h	= imagesy( $main_img_obj );
			$watermark_img_obj_w	= imagesx( $watermark_img_obj );
			$watermark_img_obj_h	= imagesy( $watermark_img_obj );


			if ($main_img_obj_w > $main_img_obj_h) {
				if ($main_img_obj_w > 650) {
					$box_width = 650;
					$box_heigth = ($main_img_obj_h * $box_width / $main_img_obj_w);
				} else {
					$box_width = $main_img_obj_w;
					$box_heigth = ($main_img_obj_h * $box_width / $main_img_obj_w);

				} 
			} else {
				if ($main_img_obj_h > 530) {
					$box_heigth = 530;
					$box_width = ($main_img_obj_w * $box_heigth / $main_img_obj_h);
				} else {
					$box_heigth = $main_img_obj_h;
					$box_width = ($main_img_obj_w * $box_heigth / $main_img_obj_h);
				} 
			}

			$water_position_x_perc =  floor( $water_position_x / $box_width * 100 );
			$water_position_y_perc =  floor( $water_position_y / $box_heigth * 100 );
	 
			$main_img_obj_min_x	= floor( $water_position_x_perc * $main_img_obj_w / 100 );
			$main_img_obj_max_x	= ceil( ( $main_img_obj_w / 2 ) + ( $watermark_img_obj_w / 2 ) );
			$main_img_obj_min_y	= floor( $water_position_y_perc * $main_img_obj_h / 100 );
			$main_img_obj_max_y	= ceil( ( $main_img_obj_h / 2 ) + ( $watermark_img_obj_h / 2 ) ); 
	 
			$return_img	= imagecreatetruecolor( $main_img_obj_w, $main_img_obj_h );
	 
			for( $y = 0; $y < $main_img_obj_h; $y++ ) {
				for( $x = 0; $x < $main_img_obj_w; $x++ ) {
					$return_color	= NULL;
	 
					$watermark_x	= $x - $main_img_obj_min_x;
					$watermark_y	= $y - $main_img_obj_min_y;
	 
					$main_rgb = imagecolorsforindex( $main_img_obj, imagecolorat( $main_img_obj, $x, $y ) );
	 
					if (	$watermark_x >= 0 && $watermark_x < $watermark_img_obj_w &&
								$watermark_y >= 0 && $watermark_y < $watermark_img_obj_h ) {
						$watermark_rbg = imagecolorsforindex( $watermark_img_obj, imagecolorat( $watermark_img_obj, $watermark_x, $watermark_y ) );
	 
						$watermark_alpha	= round( ( ( 127 - $watermark_rbg['alpha'] ) / 127 ), 2 );
						$watermark_alpha	= $watermark_alpha * $alpha_level;
	 
						$avg_red		= $this->_get_ave_color( $main_rgb['red'],		$watermark_rbg['red'],		$watermark_alpha );
						$avg_green	= $this->_get_ave_color( $main_rgb['green'],	$watermark_rbg['green'],	$watermark_alpha );
						$avg_blue		= $this->_get_ave_color( $main_rgb['blue'],	$watermark_rbg['blue'],		$watermark_alpha );
	 
						$return_color	= $this->_get_image_color( $return_img, $avg_red, $avg_green, $avg_blue );

					} else {
						$return_color	= imagecolorat( $main_img_obj, $x, $y );
	 
					} 

					
					imagesetpixel( $return_img, $x, $y, $return_color );
	 
				} 
			} 

			
			return $return_img;
	 
		} 

		function _get_ave_color( $color_a, $color_b, $alpha_level ) {
			return round( ( ( $color_a * ( 1 - $alpha_level ) ) + ( $color_b	* $alpha_level ) ) );
		} 

		function _get_image_color($im, $r, $g, $b) {
			$c=imagecolorexact($im, $r, $g, $b);
			if ($c!=-1) return $c;
			$c=imagecolorallocate($im, $r, $g, $b);
			if ($c!=-1) return $c;
			return imagecolorclosest($im, $r, $g, $b);
		} 

}

function image_unpack($type, $file) {
		    if ($type == 'jpg')
				return imagecreatefromjpeg($file);
			elseif ($type == 'png')
				return imagecreatefrompng($file);
			elseif ($type == 'gif')
				return imagecreatefromgif($file);
			return
				false;
	}

function random($length = 10) { 
		static $randStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
		$rand = ''; 
		for($i=0; $i<$length; $i++) { 
		$key = rand(0, strlen($randStr)-1); 
		$rand .= $randStr[$key]; 
		} 
		return $rand; 
	} 

function removeDirectory($dir) {
    if ($objs = glob($dir."/*")) {
       foreach($objs as $obj) {
         is_dir($obj) ? removeDirectory($obj) : unlink($obj);
       }
    }
  }

		$file1 = $_POST['mainFileText'];
		$file2 = $_POST['waterFileText'];
		$posX = $_POST['positionX'];
		$poxY = $_POST['positionY'];
		$opacity_water = $_POST['opacityWater'] * 100;

		$type1_mas = explode('.', $file1);
		$type2_mas = explode('.', $file2);
		$type1 = end($type1_mas);
		$type2 = end($type2_mas);
		
		if (!(image_unpack($type1,$file1) == false) && !(image_unpack($type2,$file2) == false) ) {
	

			$im1 = image_unpack($type1,$file1); 
			$im2 = image_unpack($type2,$file2); 

			$watermark = new watermark3();
			$im=$watermark->create_watermark($im1,$im2,$posX,$poxY,$opacity_water);

			$finalName = 'results/' . random(8) . '-water.jpg';

			imagejpeg($im,$finalName,95);
			imagedestroy($im);

			echo '<img src="' . $finalName . '">';
		} else {
			echo "Неправильные форматы файлов";
		}
		
		removeDirectory("files");

  exit;

?>