<?php
function dircpy($source, $dest, $overwrite = false){
	if($dest == '')
	{
		$dest = '.';
	}
	if(!is_dir($dest)) //Lets just make sure our new folder is already created. Alright so its not efficient to check each time... bite me
		mkdir($dest);
	if($handle = opendir($source)){        // if the folder exploration is sucsessful, continue
		while(false !== ($file = readdir($handle))){ // as long as storing the next file to $file is successful, continue
			if($file != '.' && $file != '..'){
				$path = $source . '/' . $file;
				if(is_file($path)){
					if(!is_file($dest . '/' . $file) || $overwrite)
					if(!@copy($path, $dest.'/'.$file)){
						echo '<font color="red">File ('.$path.') could not be copied, likely a permissions problem.</font>';
					}
				} elseif(is_dir($path)){
				if(!is_dir($dest . '/' . $file))
				mkdir($dest . '/' . $file); // make subdirectory before subdirectory is copied
				dircpy($path, $dest.'/'.$file, $overwrite); //recurse!
				}
			}
		}
		closedir($handle);
	}
}
if($_POST['zapros'] == 'copyfolder')
{
	$source = $_POST['source'];
	$source = iconv('UTF-8', $_POST['text_encoding'], $source);
	$dest = $_POST['dest'];
	$dest = iconv('UTF-8', $_POST['text_encoding'], $dest);
	
	dircpy($source, $dest, $_POST['overwrite'] == 'true');
}
if($_POST['zapros'] == 'copyfile')
{
	$source = $_POST['source'];
	$source = iconv('UTF-8', $_POST['text_encoding'], $source);
	$dest = $_POST['dest'];
	$dest = iconv('UTF-8', $_POST['text_encoding'], $dest);
	
	if(!file_exists($dest) || $_POST['overwrite'] == 'true')
	{
		copy($source, $dest);
	}
}
?>