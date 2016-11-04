/*Начало аккордеона "<?=$name?>"*/
$(function() {
	$( "<?=trim($pre_selector . " " . $idclass_accordion)?>" ).accordion({
<?php
	$i = 0;
	if(($active = trim($active)) != ''){$i++;}
	if($animate == 'false'){$i++;}
	if($animate == 'time'){$i++;}
	if($animate == 'type'){$i++;}
	if($animate == 'object' && $down == 'none'){$i++;}
	if($animate == 'object' && $down == 'down'){$i++;}
	if($collapsible == 'true'){$i++;}
	if($disabled == 'true'){$i++;}
	if($event == 'other'){$i++;}
	if($event != 'none' && $event != 'other'){$i++;}
	if(trim($header) != ''){$i++;}
	if(trim($heightStyle) != 'none'){$i++;}
	if($icons == 'jquery'){$i++;}
	if($icons == 'custom_font'){$i++;}
?>
<?php if(($active = trim($active)) != ''):?>
		active: <?=$active?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'false'):?>

		animate: <?='false'?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'time'):?>

		animate: <?=$animate_time?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'type'):?>

		animate: "<?=$animate_type?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'object' && $down == 'none'):?>

		animate: {
			easing: "<?=$animate_type_obj?>",
			duration: <?=$animate_time_obj?>

		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'object' && $down == 'down'):?>

		animate: {
			easing: "<?=$animate_type_obj?>",
			duration: <?=$animate_time_obj?>,
			down: {
				easing: "<?=$animate_type_down?>",
				duration: <?=$animate_time_down?>

			}
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($collapsible == 'true'):?>

		collapsible: <?='true'?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($disabled == 'true'):?>

		disabled: <?='true'?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($event == 'other'):?>

		event: "<?=$event_other?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($event != 'none' && $event != 'other'):?>

		event: "<?=$event?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($header) != ''):?>

		header: "<?=trim($header)?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($heightStyle) != 'none'):?>

		heightStyle: "<?=trim($heightStyle)?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($icons == 'jquery'):?>

		icons: {
<?php if(trim($icons_header) != ''):?>

			"header": "<?=trim($icons_header)?>"<?=trim($icons_activeHeader) != '' > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($icons_activeHeader) != ''):?>

			"activeHeader": "<?=trim($icons_activeHeader)?>"
<?php endif;?>
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($icons == 'custom_font'):?>

		icons: {
<?php if(trim($custom_font_header) != ''):?>

			"header": "<?=trim($custom_font_header)?>"<?=trim($custom_font_activeHeader) != '' > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($custom_font_activeHeader) != ''):?>

			"activeHeader": "<?=trim($custom_font_activeHeader)?>"
<?php endif;?>
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>

	});
});
/*Конец аккордеона "<?=$name?>"*/