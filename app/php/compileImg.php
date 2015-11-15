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
					$box_height = ($main_img_obj_h * $box_width / $main_img_obj_w);
				} elseif ($main_img_obj_h > 530) {
					$box_height = 530;
					$box_width = ($main_img_obj_w * $box_height / $main_img_obj_h);
				} else {
					$box_width = $main_img_obj_w;
					$box_height = $main_img_obj_h;
				} 
			} else {
				if ($main_img_obj_h > 530) {
					$box_height = 530;
					$box_width = ($main_img_obj_w * $box_height / $main_img_obj_h);
				} else {
					$box_height = $main_img_obj_h;
					$box_width = $main_img_obj_w;
				} 
			}

			$water_position_x_perc =  $water_position_x / $box_width * 100;
			$water_position_y_perc =  $water_position_y / $box_height * 100;
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
		function till_image($main_img_obj, $watermark_img_obj,  $marginVert, $marginGor) {
			$main_img_obj_w	= imagesx( $main_img_obj );
			$main_img_obj_h	= imagesy( $main_img_obj );
			$watermark_img_obj_w	= imagesx( $watermark_img_obj );
			$watermark_img_obj_h	= imagesy( $watermark_img_obj );
			if ($main_img_obj_w > $main_img_obj_h) {
				if ($main_img_obj_w > 650) {
					$q = $main_img_obj_w / 650;
				} else {
					$q = 1;
				} 
			} else {
				if ($main_img_obj_h > 530) {
					$q = $main_img_obj_h / 530;
				} else {
					$q = 1;
				} 
			}
			$marginVertNat = $marginVert * $q;
			$marginGorNat = $marginGor * $q;
			$till_img_elems_w = floor( $main_img_obj_w / $watermark_img_obj_w);
			$till_img_elems_h = floor( $main_img_obj_h / $watermark_img_obj_h);
			$till_img_obj_w = $till_img_elems_w * 2 * ($watermark_img_obj_w + $marginGorNat);
			$till_img_obj_h = $till_img_elems_h * 2 * ($watermark_img_obj_h + $marginVertNat);
			$return_img	= imagecreatetruecolor( $till_img_obj_w, $till_img_obj_h );
			imagesavealpha($return_img, true);
			$trans_color = imagecolorallocatealpha($return_img, 0, 0, 0, 127);
			imagefill($return_img,0,0,$trans_color);
			for( $y = 1; $y < ($till_img_elems_h + 1) * 2; $y++ ) {
				for( $x = 1; $x < ($till_img_elems_w + 1) * 2; $x++ ) {
					imagecopy($return_img, $watermark_img_obj, ($watermark_img_obj_w + $marginGorNat) * $x, ($watermark_img_obj_h + $marginVertNat) * $y, 0, 0, $watermark_img_obj_w, $watermark_img_obj_h);
				}
			}
			return $return_img;
		}

		function resize_watermark($main_img_obj, $watermark_img_obj) {
			$main_img_obj_w	= imagesx( $main_img_obj );
			$main_img_obj_h	= imagesy( $main_img_obj );
			$watermark_img_obj_w	= imagesx( $watermark_img_obj );
			$watermark_img_obj_h	= imagesy( $watermark_img_obj );
			if ($watermark_img_obj_w > $main_img_obj_w) {
				$new_watermark_w = $main_img_obj_w;
				$new_watermark_h = $watermark_img_obj_h / $watermark_img_obj_w * $main_img_obj_w;
				if ($new_watermark_h > $main_img_obj_h) {
					$new_watermark_h = $main_img_obj_h;
					$new_watermark_w = $new_watermark_w / $new_watermark_h * $main_img_obj_h;
				}
			} elseif ($watermark_img_obj_h > $main_img_obj_h) {
					$new_watermark_h = $main_img_obj_h;
					$new_watermark_w = $watermark_img_obj_w / $watermark_img_obj_h * $main_img_obj_h;
			} else {
				$new_watermark_h = $watermark_img_obj_h;
				$new_watermark_w = $watermark_img_obj_w;
			}
			$return_img = imagecreatetruecolor($new_watermark_w, $new_watermark_h);
			imageAlphaBlending($return_img, false);
			imageSaveAlpha($return_img, true);
			ImageCopyResampled($return_img, $watermark_img_obj, 0, 0, 0, 0, $new_watermark_w, $new_watermark_h, $watermark_img_obj_w, $watermark_img_obj_h); 
			return $return_img;
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
  		$data = json_decode($_POST['jsonData']);
		$file1 = $data -> {'urlMain'};
		$file2 = $data -> {'urlWater'};
		$posX = $data -> {'posX'};
		$posY = $data -> {'posY'};
		$margX = $data -> {'margX'};
		$margY = $data -> {'margY'};
		$opacity_water = $data -> {'opacity'} * 100;
		$mode = $data -> {'mode'};
		$data = array();
		$type1_mas = explode('.', $file1);
		$type2_mas = explode('.', $file2);
		$type1 = end($type1_mas);
		$type2 = end($type2_mas);
		
		if (!(image_unpack($type1,$file1) == false) && !(image_unpack($type2,$file2) == false) ) {
	
			$im1 = image_unpack($type1,$file1); 
			$im2 = image_unpack($type2,$file2); 
			$watermark = new watermark3();
			if ($mode == 'normal') {
				$im2=$watermark->resize_watermark($im1,$im2);
				$im=$watermark->create_watermark($im1,$im2,$posX,$posY,$opacity_water);
			} elseif ($mode == 'till') {
				$im2=$watermark->resize_watermark($im1,$im2);
				$till_img=$watermark->till_image($im1,$im2,$margY,$margX);
				$im=$watermark->create_watermark($im1,$till_img,$posX,$posY,$opacity_water);
			}

			if (!(file_exists('results'))) {
				mkdir('results');
			}

			$finalName = 'results/' . random(8) . '-water.jpg';
  			imagejpeg($im,$finalName, 90);
			imagedestroy($im);
  			$data['status'] = 'OK';
			$data['text'] = 'Выполнено! Получите ссылку';
			$data['url'] = $finalName;
		} else {
			$data['status'] = 'ERROR!';
			$data['text'] = 'Введите правильные файлы!';
		}
		
		removeDirectory("files");
		header("Content-Type: application/json");
		echo json_encode($data);
  exit;
?>