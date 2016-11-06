<?
	error_reporting(0);
    $dir = $_POST['dir'];
	$dir = iconv('UTF-8', $_POST['text_encoding'], $dir);
    $res = file_exists($dir);
    if ($res)
    {
        echo 'true';
    }
    else{
        echo 'false';
    }
?>