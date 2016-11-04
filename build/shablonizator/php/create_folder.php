<?
    $dir = $_POST['dir'];
	$dir = iconv('UTF-8', $_POST['text_encoding'], $dir);
	
	if(!is_dir($dir))
	{
		if(mkdir($dir, 0777, true) == false)
		{
			echo("neudacha");
		}
	}
?>