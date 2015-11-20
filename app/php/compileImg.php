<?php

	// Функция наложения водяного знака на изображение, 
	// поддерживает работу с PNG24
	function create_watermark( $main_img_obj, $watermark_img_obj, $water_position_x, $water_position_y, $alpha_level = 100 ) {
		// Определяем начальные параметры изображений
		$alpha_level	/= 100;	
		$main_img_obj_w	= imagesx( $main_img_obj );
		$main_img_obj_h	= imagesy( $main_img_obj );
		$watermark_img_obj_w	= imagesx( $watermark_img_obj );
		$watermark_img_obj_h	= imagesy( $watermark_img_obj );

		// Выясняем масштабировались ли изображения на клиента, и если да
		// то выясняем до каких размеров
		// Выясняем для дальнейшего определения итоговой координаты расположения
		// водяного знака на исходном изображении

		// Проверяем ориентацию изображения
		if ($main_img_obj_w > $main_img_obj_h) {
			// Выясняем ширина основного изображения больше ширины блока
			if ($main_img_obj_w > 650) {
				// Если да, то вычисляем размеры изображения в блоке
				$box_width = 650;
				$box_height = ($main_img_obj_h * $box_width / $main_img_obj_w);
				// Проверяем получившиеся размеры
				// может высота больше, высоты блока
				if ($box_height > 530) {
					// Если да, то вычисляем размеры изображения в блоке
					$box_height = 530;
					$box_width = ($main_img_obj_w * $box_height / $main_img_obj_h);
				}
			}  else {
				// Если ширина меньше ширины блока
				// может высота больше, высоты блока 
				if ($main_img_obj_h > 530) {
					// Если да, то вычисляем размеры изображения в блоке
					$box_height = 530;
					$box_width = ($main_img_obj_w * $box_height / $main_img_obj_h);
				} else {
					// Если нет, то размеры блока, равны размерам картинки
					$box_height = $main_img_obj_h;
					$box_width = $main_img_obj_w;
				} 
			}
		} else {
			// Если картинка вертикальной ориентации
			// смотрим больше ли высота изображения, высоты блока
			if ($main_img_obj_h > 530) {
				// Если да, то вычисляем размеры изображения в блоке
				$box_height = 530;
				$box_width = ($main_img_obj_w * $box_height / $main_img_obj_h);
			} else {
				// Если нет, то размеры блока, равны размерам картинки
				$box_height = $main_img_obj_h;
				$box_width = $main_img_obj_w;
			} 
		}

		// Высчитываем итоговые координаты положения водяного знака 
		// на основном изображении
		$water_position_x_perc =  $water_position_x / $box_width * 100;
		$water_position_y_perc =  $water_position_y / $box_height * 100;
		$main_img_obj_min_x	= floor( $water_position_x_perc * $main_img_obj_w / 100 );
		$main_img_obj_min_y	= floor( $water_position_y_perc * $main_img_obj_h / 100 );
	 
	 	// Создаем холст с результирующим изображением
		$return_img	= imagecreatetruecolor( $main_img_obj_w, $main_img_obj_h );
	 
	 	// Начинаем его попиксельно заполнять
	 	// цикл по Y координатам
		for( $y = 0; $y < $main_img_obj_h; $y++ ) {
			// цикл по X координатам
			for( $x = 0; $x < $main_img_obj_w; $x++ ) {
				$return_color	= NULL;
	 			
	 			// Расчитываем, когда заливать водяной знак
				$watermark_x	= $x - $main_img_obj_min_x;
				$watermark_y	= $y - $main_img_obj_min_y;
	 			
	 			// Берем цвет основного изображения по данным координатам
				$main_rgb = imagecolorsforindex( $main_img_obj, imagecolorat( $main_img_obj, $x, $y ) );
	 
	 			// Если пришло время заливтаь водяной знак, то ...
				if (	$watermark_x >= 0 && $watermark_x < $watermark_img_obj_w &&
							$watermark_y >= 0 && $watermark_y < $watermark_img_obj_h ) {

					// Берем цвет водяного знака в по данным координатам
					$watermark_rbg = imagecolorsforindex( $watermark_img_obj, imagecolorat( $watermark_img_obj, $watermark_x, $watermark_y ) );
	 
	 				// Рассчитываем прозрачность водяного знака
					$watermark_alpha	= round( ( ( 127 - $watermark_rbg['alpha'] ) / 127 ), 2 );
					$watermark_alpha	= $watermark_alpha * $alpha_level;

					// Совмещаем пиксели основного изображения и водяного знака по сооставляющим с применением прозрачности
					$avg_red		= _get_ave_color( $main_rgb['red'],		$watermark_rbg['red'],		$watermark_alpha );
					$avg_green	= _get_ave_color( $main_rgb['green'],	$watermark_rbg['green'],	$watermark_alpha );
					$avg_blue		= _get_ave_color( $main_rgb['blue'],	$watermark_rbg['blue'],		$watermark_alpha );
	 
	 				// Возвращаем итоговый цвет
					$return_color	= _get_image_color( $return_img, $avg_red, $avg_green, $avg_blue );
				} else {
					// Итоговый цвет равен цветам основного изображения
					$return_color	= imagecolorat( $main_img_obj, $x, $y );
				} 
				
				// Рисуем пиксель на холсте
				imagesetpixel( $return_img, $x, $y, $return_color );
	 
			} 
		} 
		
		// Возвращаем изображение
		return $return_img;
	 
	} 

	// Функция складывания цветов с применением прозрачности
	function _get_ave_color( $color_a, $color_b, $alpha_level ) {
		return round( ( ( $color_a * ( 1 - $alpha_level ) ) + ( $color_b	* $alpha_level ) ) );
	} 

	// Функция складывания компонент цветов из двух изображений
	function _get_image_color($im, $r, $g, $b) {
		$c=imagecolorexact($im, $r, $g, $b);
		if ($c!=-1) return $c;
		$c=imagecolorallocate($im, $r, $g, $b);
		if ($c!=-1) return $c;
		return imagecolorclosest($im, $r, $g, $b);
	} 

	// Функция создания замощенного водяного знака
	// с поддержкой PNG24
	function till_image($main_img_obj, $watermark_img_obj,  $marginVert, $marginGor) {
		// Определяем начальные параметры изображений
		$main_img_obj_w	= imagesx( $main_img_obj );
		$main_img_obj_h	= imagesy( $main_img_obj );
		$watermark_img_obj_w	= imagesx( $watermark_img_obj );
		$watermark_img_obj_h	= imagesy( $watermark_img_obj );

		// Вычисляем коэффициент, во сколько раз основное изображение
		// больше блока на странице.
		// Вычисляем это для масштабирования отступов, полученных
		// со страницы

		// Выясняем ориентацию изображение
		// если горизонтальная, то
		if ($main_img_obj_w > $main_img_obj_h) {
			//Проверяем больше ли ширина изображения, ширины блока
			if ($main_img_obj_w > 650) {
				// Если да - вычисляем коэффициент относительно ширины
				$q = $main_img_obj_w / 650;
				// И проверяем получившуюся в итоге высоту
				// может она еще больше высоты блока
				if ($main_img_obj_h / $q > 530) {
					// Если да, то вычисляем относительно высоты коэффициент
					$q = $main_img_obj_h / 530;
				}
			} else {
				// Если ширина меньше
				// проверяем больше ли высота изображения, высоты блока
				if ($main_img_obj_h > 530) {
					// Если да, то вычисляем относительно высоты коэффициент
					$q = $main_img_obj_h / 530;
				} else {
					// Если нет, q = 1;
					$q = 1;
				} 
			}
		} else {
			// Если ориентация портретная, то 
			// проверяем больше ли высота изображения, высоты блока
			if ($main_img_obj_h > 530) {
				// Если да, то вычисляем относительно высоты коэффициент
				$q = $main_img_obj_h / 530;
			} else {
				// Если нет, q = 1;
				$q = 1;
			} 
		}

		// Вычисляем итоговый размер наших отступов
		$marginVertNat = $marginVert * $q;
		$marginGorNat = $marginGor * $q;

		// Выясняем сколько водяныз знаков помещается по высоте и ширине в основную картинку
		$till_img_elems_w = floor( $main_img_obj_w / $watermark_img_obj_w);
		$till_img_elems_h = floor( $main_img_obj_h / $watermark_img_obj_h);

		// Рассчитываем итоговые размеры холста - кол-во изображений * 2 * на размеры + отступы
		$till_img_obj_w = $till_img_elems_w * 2 * ($watermark_img_obj_w + $marginGorNat);
		$till_img_obj_h = $till_img_elems_h * 2 * ($watermark_img_obj_h + $marginVertNat);

		// Создаем холст с итовой картинкой
		$return_img	= imagecreatetruecolor( $till_img_obj_w, $till_img_obj_h );

		// Сохраняем каналы прозрачности
		imagesavealpha($return_img, true);
		$trans_color = imagecolorallocatealpha($return_img, 0, 0, 0, 127);
		imagefill($return_img,0,0,$trans_color);

		// Заполняем наш холст водяными знаками
		// цикл по строкам
		for( $y = 0; $y < ($till_img_elems_h + 1) * 2; $y++ ) {
			// цикл по столбцам
			for( $x = 0; $x < ($till_img_elems_w + 1) * 2; $x++ ) {
				// Копируем водяной знак в рассчитанные координаты
				imagecopy($return_img, $watermark_img_obj, ($watermark_img_obj_w + $marginGorNat) * $x, ($watermark_img_obj_h + $marginVertNat) * $y, 0, 0, $watermark_img_obj_w, $watermark_img_obj_h);
			}
		}

		// Возвращаем итовое замощенное изображение
		return $return_img;
	}

	// Функция на тот случай, если водяной знак больше главного изображения
	function resize_watermark($main_img_obj, $watermark_img_obj) {
		// Определяем начальные параметры изображений
		$main_img_obj_w	= imagesx( $main_img_obj );
		$main_img_obj_h	= imagesy( $main_img_obj );
		$watermark_img_obj_w	= imagesx( $watermark_img_obj );
		$watermark_img_obj_h	= imagesy( $watermark_img_obj );

		// Проверяем размеры 
		// Если ширина водяного знака больше ширины главного изображения
		if ($watermark_img_obj_w > $main_img_obj_w) {
			// Рассчитываем новые размеры водяного знака
			$new_watermark_w = $main_img_obj_w;
			$new_watermark_h = $watermark_img_obj_h / $watermark_img_obj_w * $main_img_obj_w;
			// Если новая высота водяного знака больше высоты главного изображения
			if ($new_watermark_h > $main_img_obj_h) {
				// Рассчитываем новые размеры водяного знака
				$new_watermark_h = $main_img_obj_h;
				$new_watermark_w = $new_watermark_w / $new_watermark_h * $main_img_obj_h;
			}
		// Если ширина меньше, то сравниваем высоту
		} elseif ($watermark_img_obj_h > $main_img_obj_h) {
			// Если высота водяного знака больше высоты основного изображения
			// рассчитываем новые размеры водяного знака
			$new_watermark_h = $main_img_obj_h;
			$new_watermark_w = $watermark_img_obj_w / $watermark_img_obj_h * $main_img_obj_h;
		} else {
			// Если водяной знак меньше изображения, то новые размеры равны старым
			$new_watermark_h = $watermark_img_obj_h;
			$new_watermark_w = $watermark_img_obj_w;
		}

		// Создаем холст с новыми размерами
		$return_img = imagecreatetruecolor($new_watermark_w, $new_watermark_h);

		//Сохраняем прозрачность
		imageAlphaBlending($return_img, false);
		imageSaveAlpha($return_img, true);

		// Копируем с изменением размера водяной знак на холст
		ImageCopyResampled($return_img, $watermark_img_obj, 0, 0, 0, 0, $new_watermark_w, $new_watermark_h, $watermark_img_obj_w, $watermark_img_obj_h); 

		// Выводим итоговый водяной знак
		return $return_img;
	}

// Функция проверки форматов файлов и их распаковки в скрипте
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
// Фунция генерации случайного имени файла
function random($length = 10) { 
		static $randStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
		$rand = ''; 
		for($i=0; $i<$length; $i++) { 
			$key = rand(0, strlen($randStr)-1); 
			$rand .= $randStr[$key]; 
		} 
		return $rand; 
	} 

		// Вводим значения в скрипт
		// Распаковываем JSON строку
  		$data = json_decode($_POST['jsonData']);
  		// Присваиваем параметры переменным
		$file1 = $data -> {'urlMain'};
		$file2 = $data -> {'urlWater'};
		$posX = $data -> {'posX'};
		$posY = $data -> {'posY'};
		$margX = $data -> {'margX'};
		$margY = $data -> {'margY'};
		$opacity_water = $data -> {'opacity'} * 100;
		$mode = $data -> {'mode'};
		
		// Создаем массим вывода данных
		$data = array();

		// Узнаем расширения изображений
		$type1_mas = explode('.', $file1);
		$type2_mas = explode('.', $file2);
		$type1 = end($type1_mas);
		$type2 = end($type2_mas);
		
		// Если файла правильных форматов и могут распоковаться
		if (!(image_unpack($type1,$file1) == false) && !(image_unpack($type2,$file2) == false) ) {
	
			// То распаковываем их
			$im1 = image_unpack($type1,$file1); 
			$im2 = image_unpack($type2,$file2); 

			// Если режим с одним водяным знаком то 
			if ($mode == 'normal') {
				// Изменяем размер знака, на случай, если он больше основного изображения
				$im2=resize_watermark($im1,$im2);
				// Создаем итоговое изображение
				$im=create_watermark($im1,$im2,$posX,$posY,$opacity_water);
			// Если режим замощения 
			} elseif ($mode == 'till') {
				// Изменяем размер знака, на случай, если он больше основного изображения
				$im2=resize_watermark($im1,$im2);
				// Создаем изображение с замощенным водяным знаком
				$till_img=till_image($im1,$im2,$margY,$margX);
				// Создаем итоговое изображение
				$im=create_watermark($im1,$till_img,$posX,$posY,$opacity_water);
			}

			// Проверяем наличие папки result, и если её нет, то создаем
			if (!(file_exists('results'))) {
				mkdir('results');
			}

			// Формируем имя файла
			$finalName = 'results/' . random(8) . '-water.jpg';

			// Сохраняем картинку в файл, с заданным коэффициентом сжатия
  			imagejpeg($im,$finalName, 90);

  			// Уничтожаем её
			imagedestroy($im);

			// Если все хорошо, то выводим данные из скрипты
  			$data['status'] = 'OK';
			$data['text'] = 'Выполнено! Получите ссылку';
			$data['url'] = $finalName;
		} else {
			// Если все плохо, выводим сообщение о ошибке из скрипта
			$data['status'] = 'ERROR!';
			$data['text'] = 'Введите правильные файлы!';
		}
		
		// Выводим JSON строку
		header("Content-Type: application/json");
		echo json_encode($data);
  exit;
?>