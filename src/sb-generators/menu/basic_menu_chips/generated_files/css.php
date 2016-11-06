<? if($custom_css == 'custom_css'): ?>
/*Начало меню "<?=$name?>"*/
<?=$selector?> {
<?php foreach(normal_tabs($custom_css_code) as $line):?>
    <?=$line?>
<?php endforeach;?>
}
/*Конец меню "<?=$name?>"*/
<? endif; ?>