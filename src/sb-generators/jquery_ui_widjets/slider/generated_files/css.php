/*Начало аккордеона "<?=$name?>"*/
<?php if(trim($pre_selector) != ''):?>
<?=trim($pre_selector)?> {
<?php endif;?>

<?php if($container_reset == 'container_no_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($container_css) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php elseif($container_reset == 'container_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($container_css_reset) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php endif;?>
<?php if($range_reset == 'range_no_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($range_css) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php elseif($range_reset == 'range_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($range_css_reset) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php endif;?>
<?php if($polzunok_reset == 'polzunok_no_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($polzunok_css) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php elseif($polzunok_reset == 'polzunok_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($polzunok_css_reset) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php endif;?>
<?php if(trim($pre_selector) != ''):?>
}
<?php endif;?>
/*Конец аккордеона "<?=$name?>"*/