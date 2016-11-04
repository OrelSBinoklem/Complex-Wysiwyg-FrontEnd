<?php
    $filename = iconv('UTF-8', $_POST['text_encoding'], $_POST['url']);
    //Проверка существования папки или файла (возможно вначале надо будет добавить слешы)
    if(!@file_exists($filename))
    {
        return 'notexists';//Папка несуществует
    }
        
    if(!is_dir($filename))
    {
        echo filemtime($filename);
    }
?>