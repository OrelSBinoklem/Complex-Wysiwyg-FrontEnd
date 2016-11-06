<?
	error_reporting(0);
    $dir = $_POST['dir'];
	$dir = iconv('UTF-8', $_POST['text_encoding'], $dir);
    $fp = fopen($dir, "r");
    if ($fp)
    {
        while (!feof($fp)) {
           $line = fgets($fp);
           echo $line;
        }
        fclose($fp);
    }
    else{
        echo "error_getfile_shablonizator156418546585415";
    }
?>