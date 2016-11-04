<?php
//Показать все ошибки кроме мелких предупреждений (денвер ругаеться)
//ini_set('error_reporting', E_ALL & ~E_NOTICE);
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);

//Передовать кодировку со скрипта "text Encoding" "ASCII", "windows-1251", "UTF-8"
//Узнавать есть ли в папке файлы или другие папки чтобы определять отображать "+" возле папки или нет

require_once 'filemanager_library.php';

$textEncoding;
$esli_nado_podgruzit_papku = false;

if(isset($_POST['text_encoding']))
{
    $textEncoding = $_POST['text_encoding'];
}

if(isset($_POST['zapros']))
{
    switch ($_POST['zapros']) {
    case 'start':
        clearstatcache();
        //$start_time = microtime(true);
        echo start_generation();
        //$end_time = microtime(true);
        //echo round(($end_time-$start_time),5)." сек";
        break;
    case 'zapisat_xml':
        zapis_xml();
        break;
    case 'podgruzit_papku':
        clearstatcache();
        $esli_nado_podgruzit_papku = true;
        echo podgruzka_papki();
        break;
    }
}

function start_generation()
{
    global $xml;
    $xmlFile = __DIR__;
    preg_match('/^(.*)shablonizator(\\|\/)php$/', $xmlFile, $xmlFile);
    $xmlFile = $xmlFile[1].$_POST['xml_fail'];
    $xml = new SimpleXMLElement($xmlFile, null, TRUE);
    $dir = '.';
    return getLinkDir($dir);
}

function podgruzka_papki()
{
    $dir = $_POST['dir'];
    return getLinkDir($dir);
}

function getLinkDir($dirname)
{
    global $esli_nado_podgruzit_papku, $xml, $textEncoding;
    
    if($esli_nado_podgruzit_papku)
    {
        $dirname = iconv('UTF-8', $textEncoding, $dirname);
        $dirFilesArr = get_contents_dir_xml($dirname);
    }
    else
    {
        $dirFilesArr = get_contents_dir_xml($dirname);
    }
    
    //Папка несуществует
    if($dirFilesArr === 'notexists')
    {
        return '<error error="notexists"></error>';
    }
    //Ошибка открытия папки
    elseif($dirFilesArr === 'error')
    {
        return '<error error="unable_to_open_directory"></error>';
    }
    //==========
    //Папка с содержимым
    elseif(count($dirFilesArr) > 0)
    {
        $res = '';        
        foreach($dirFilesArr as $DirFileOne)
        {
            if($DirFileOne['isdir'])
            //Добавляем папку
            {
                $temp_folder = '';
                $flag_papka_est = false;
                //Если надо подгрузить папку (смотрим xml - если папка была раскрыта в прошлой сессии, то подгружаем её)
                
                if($esli_nado_podgruzit_papku == false)
                {
                    $urlUTF8 = iconv($textEncoding, 'UTF-8', $DirFileOne['url']);
                    $temp_folder = $xml->xpath('//folder[@href="'.$urlUTF8.'"]');
                    if(count($temp_folder) > 0)
                    {
                        $flag_papka_est = true;
                    }
                }
                else
                {
                    $flag_papka_est = false;
                }
                $res .= $DirFileOne['before'];
                //Если папка была открыта в прошлой сессии, то загружаем её содержимое
                if($flag_papka_est)
                {
                    $res .= getLinkDir($DirFileOne['url']);
                }
                //==========
                $res .= $DirFileOne['after'];
            }
            //==========
            //Добавляем папку
            else
            {
                $res .= $DirFileOne['before'];
                $res .= $DirFileOne['after'];
            }
            //==========
        }
        return $res;        
    }
    //Пустая папка
    else
    {
        return '<empty></empty>';
    }
    //==========
}

/***********************************************************************/
/*Принимаем и записываем xml в котором храняться адреса раскрытых папок*/
/***********************************************************************/
function zapis_xml()
{
    if(isset($_POST['papki_xml']))
    {
        $xmlFile = __DIR__;
        preg_match('/^(.*)shablonizator(\\|\/)php$/', $xmlFile, $xmlFile);
        $xmlFile = $xmlFile[1].$_POST['xml_fail'];
        file_put_contents($xmlFile, '<?xml version="1.0" encoding="UTF-8"?><wrap>'.$_POST['papki_xml'].'</wrap>');
    }
}
?>