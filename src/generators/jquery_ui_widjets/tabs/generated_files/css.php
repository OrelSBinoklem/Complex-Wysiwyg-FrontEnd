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
<?php if($headers_reset == 'headers_no_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($headers_css) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php elseif($headers_reset == 'headers_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($headers_css_reset) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php endif;?>
<?php if($content_reset == 'content_no_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($content_css) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php elseif($content_reset == 'content_reset'):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($content_css_reset) as $line):?>
	<?=$line?>
<?php endforeach;?>
}
<?php endif;?>
<?php if(trim($pre_selector) != ''):?>
}
<?php endif;?>
/*Конец аккордеона "<?=$name?>"*/