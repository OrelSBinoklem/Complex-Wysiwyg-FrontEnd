<?php
error_reporting(0);

$generators_folder = "../../sb-generators/" . iconv('UTF-8', $_POST['text_encoding'], $_POST["folder_generator"]) . '/generators-files';

$arr_datafile = array();
function generators_included($currentFolder){
	global $arr_datafile;
	global $generators_folder;
	if($handle = opendir($currentFolder)){
		while(false !== ($file = readdir($handle))){
			if($file != '.' && $file != '..'){
				$path = $currentFolder . '/' . $file;
				if(is_file($path)){
					if(preg_match("/\.js$/i", $path)){
						$name = substr($path, strlen($generators_folder . '/'));
						$name = substr($name, 0, strlen($name) - strlen('.js'));
						$arr_datafile[] = array("name" => $name, "path" => $path);
					}
				} elseif(is_dir($path)){
					generators_included($path);
				}
			}
		}
		closedir($handle);
	} else {
		echo "console.log(\"Error open dir:" . $_POST["folder_generator"] . "\");\n";
	}
}
generators_included( $generators_folder );

foreach($arr_datafile as $file)
{
	$path = iconv('UTF-8', $_POST['text_encoding'], $file['path']);
	$fp = fopen($path, "r");
	$text = "";
	if ($fp)
	{
		while (!feof($fp)) {
			$line = fgets($fp);
			$text .= $line;
		}
		fclose($fp);
	}
	else{
		$text = "console.log(\"Error load file:" . $file['path'] . "\");";
	}
	
	echo $text . "
	";
	echo "fns[\"" . $file['name'] . "\"] = fn
	";
}
?>