<?php

/***********************************************************************/
/*Получение списка файлов и папок в папке в виде xml*/
/***********************************************************************/

Function get_contents_dir_xml($dirname)
{
    global $textEncoding;
    $dirEntries = Array();
    $result = Array();
        
    //Проверка существования папки или файла (возможно вначале надо будет добавить слешы)
    if(!@file_exists($dirname))
    {
        return 'notexists';//Папка несуществует 
    }
    
    //Открытие папки и проверка на читаемость
    if(!$dirid = @opendir($dirname))
    {      
        return 'error';//Ошибка открытия папки  
    }
    //==========
    //Фильтрация от "." и ".."        
    while($entry = @readdir($dirid)) 
    {
        if($entry != "." && $entry != "..")
        {
            $dirEntries[] = $entry;
        }
    }
    //==========
    $i = 0;
    //Если в dirname точка "." то удаляем её
    if($dirname == '.')
    {
        $dirname = '';
    }
    else {
        $dirname .= '/';
    }
    /*-----------------------*/
    //Создаем массив из папок и файлов
    while($dirEntries[$i])
    {
        $fileNameShort = $dirEntries[$i];
        $fileName = $dirname.$fileNameShort;
        
        $fileNameUTF8 = iconv($textEncoding, 'UTF-8', $fileName);
        $fileNameShortUTF8 = iconv($textEncoding, 'UTF-8', $fileNameShort);
        
        if(is_dir($fileName))
        {
            $result[] = array('before' => '<folder url_utf8="'.$fileNameUTF8.'" name_utf8="'.$fileNameShortUTF8.'" create="'.filectime($fileName).'" modified="'.filemtime($fileName).'">','after' => '</folder>', 'url' => $fileName, 'name' => $fileNameShort, 'isdir' => true);
        }
        else
        {
            if(preg_match('/(jpg|png|gif)$/i', $fileName) == 1)
            {
                $WHImaje = getimagesize($fileName);
                $result[] = array('before' => '<file url_utf8="'.$fileNameUTF8.'" name_utf8="'.$fileNameShortUTF8.'" create="'.filectime($fileName).'" modified="'.filemtime($fileName).'" size="'.filesize($fileName).'" width="'.$WHImaje[0].'" height="'.$WHImaje[1].'" image="image">', 'after' => '</file>','url' => $fileName, 'name' => $fileNameShort, 'isdir' => false);
            }
            else
            {
                $result[] = array('before' => '<file url_utf8="'.$fileNameUTF8.'" name_utf8="'.$fileNameShortUTF8.'" create="'.filectime($fileName).'" modified="'.filemtime($fileName).'" size="'.filesize($fileName).'">', 'after' => '</file>','url' => $fileName, 'name' => $fileNameShort, 'isdir' => false);
            }
            
        }
        $i++;
    }
    return $result;
    //==========
}
?>