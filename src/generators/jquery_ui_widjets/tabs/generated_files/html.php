<?php
    if(substr($idclass_accordion, 0, 1) == '.')
    {
        $idClass = ' class="' . substr($idclass_accordion, 1) . '"';
    }
    else
    {
        $idClass = ' id="' . substr($idclass_accordion, 1) . '"';
    }
?>
<!--Начало табов "<?=$name?>"-->
<div<?=$idClass?>>
<?php only_array($zagolovok); ?>
<?php only_array($content); ?>
<?php only_array($id_tab); ?>
    <ul>
<?php foreach($zagolovok as $key => $value):?>
	   <li><a href="#<?=$id_tab[$key]?>"><?=$value?></a></li>
<?php endforeach;?>
    </ul>
<?php foreach($zagolovok as $key => $value):?>
    <div id="<?=$id_tab[$key]?>">
<?php foreach(normal_tabs($content[$key]) as $line):?>
	   <?=$line?>
<?php endforeach;?>

    </div>
<?php endforeach;?>
</div>
<!--Конец табов "<?=$name?>"-->