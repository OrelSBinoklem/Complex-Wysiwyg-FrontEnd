<?
$dir_scrins = $_POST['dir_scrins'];
$dir_miniatyrki = $_POST['dir_miniatyrki'];
$width_miniatyrki = intval( $_POST['width_miniatyrki'] );



function images_size($tmp_name, $new_name, $resolution_width){

 $params = getimagesize($tmp_name) ;
 //пишем фото --------->
 //получаем нужные переменные
switch ($params['2']) {
 case 1: $old_img = imagecreatefromgif($tmp_name); break;
 case 2: $old_img = imagecreatefromjpeg($tmp_name); break;
 case 3: $old_img = imagecreatefrompng($tmp_name); break;
 case 6: $old_img = imagecreatefromwbmp($tmp_name); break;
 }
 //вычисляем новые размеры
 $size = $params['0'] ;
 $resolution = $resolution_width;
 
 $new_width = floor($params['0'] * $resolution / $size);
 $new_height = floor($params['1'] * $resolution / $size);
 //создаём новое изображение
$new_img = imagecreatetruecolor($new_width, $new_height);
 imagecopyresampled ($new_img, $old_img, 0, 0, 0, 0, $new_width, $new_height, $params['0'], $params['1']);

 //сохраняем новое изображение----->>>>>>
 //определяем тип изображения
switch ($params['2']) {
 case 1: $type = '.gif'; break;
 case 2: $type = '.jpg'; break;
 case 3: $type = '.png'; break;
 case 6: $type = '.bmp'; break;
 }
 //Сохраняем
 switch ($type) {
 case '.gif': imagegif($new_img, $new_name); break;
 case '.jpg': imagejpeg($new_img, $new_name, 95); break;
 case '.bmp': imagejpeg($new_img, $new_name, 95); break;
 case '.png': imagepng($new_img, $new_name); break;
 }
 imagedestroy($old_img);
}







function DIR_scrin($dir) {//Заменить на что нибудь попроще
	$handle = opendir('./'.$dir.'');
    
    $allScrinName = array();
	while(false !== ($file = readdir($handle)))
	{
		if($file != '.' && $file != '..' && $file != 'desktop.ini')
		{
            if($dir == '')
            {
                $fileway = './'.$file;
            }
            else
            {
                $fileway = $dir.'/'.$file;
            }
			if(filetype($fileway) == 'file')
			{
				$ext1 = explode('.', $file);
				$ext = $ext1[count($ext1)-1];
				if($ext == 'jpg' || $ext == 'png')
				{
					array_push($allScrinName, "".$file);
				}
			}
		}
	}
    closedir($handle);
    return $allScrinName;
}
    
    
$allScrinName = DIR_scrin($dir_scrins);
$WidthScrin = array();
$HeightScrin = array();
foreach($allScrinName as $ScrinName)
{
    $sizeScrin = getimagesize($dir_scrins.'/'.$ScrinName);
    array_push($WidthScrin, $sizeScrin[0]);
    array_push($HeightScrin, $sizeScrin[1]);
}

$allMiniatyrkiName = DIR_scrin($dir_miniatyrki);

//Добавляем миниатюрки на новые скрины
foreach($allScrinName as $ScrinName) {
    $flajok = true;
    foreach($allMiniatyrkiName as $MiniatyrkaName)
    {
        if($ScrinName == $MiniatyrkaName)
        {
            $flajok = false;
        }
    }
    if($flajok)
    {
        images_size($dir_scrins.'/'.$ScrinName, $dir_miniatyrki.'/'.$ScrinName, $width_miniatyrki);
    }
}
//Удаляем миниатюрки на скрины которые были удалены
foreach($allMiniatyrkiName as $MiniatyrkaName) {
    $flajok = true;
    foreach($allScrinName as $ScrinName)
    {
        if($ScrinName == $MiniatyrkaName)
        {
            $flajok = false;
        }
    }
    if($flajok)
    {
        unlink($dir_miniatyrki.'/'.$MiniatyrkaName);
    }
}

$xml_all_scrins = "";
$count = count($allScrinName);
for($k = 0; $k < $count; $k++)
{
    $xml_all_scrins .= "<scrin src=\"" . $allScrinName[$k] . "\" width=\"" . $WidthScrin[$k] . "\" height=\"" . $HeightScrin[$k] . "\"/>";
}
echo $xml_all_scrins;
?>