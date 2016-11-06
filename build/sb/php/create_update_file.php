<?
    $dir = $_POST['dir'];
	$dir = iconv('UTF-8', $_POST['text_encoding'], $dir);
    $file_text = $_POST['file_text'];
	
	if(!file_exists($dir) || $_POST['overwrite'] == 'true')
	{
		$f = fopen($dir, "w");

		ftruncate($f, 0); // очищаем файл до 0 байтов.
		
		// Записать текст
		if(fwrite($f, $file_text) == false)
		{
			echo("neudacha");
		}
		// Закрыть текстовый файл
		fclose($f);
	}
?>