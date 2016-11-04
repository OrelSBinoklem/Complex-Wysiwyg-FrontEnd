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
<!--Начало аккордеона "<?=$name?>"-->
<div<?=$idClass?>>
<?php only_array($zagolovok); ?>
<?php only_array($content); ?>
<?php foreach($zagolovok as $key => $value):?>
	<h3><?=$value?></h3>
	<div>
<?php foreach(normal_tabs($content[$key]) as $line):?>
		<?=$line?>
<?php endforeach;?>

	</div>
<?php endforeach;?>
</div>
<!--Конец аккордеона "<?=$name?>"-->