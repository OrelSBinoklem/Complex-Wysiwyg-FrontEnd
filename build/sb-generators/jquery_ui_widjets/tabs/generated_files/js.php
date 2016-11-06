/*Начало аккордеона "<?=$name?>"*/
$(function() {
	$( "<?=trim($pre_selector . " " . $idclass_accordion)?>" ).tabs({
<?php
	$i = 0;
	if(($active = trim($active)) != ''){$i++;}
	if($collapsible == 'true'){$i++;}
	if($disabled == 'true'){$i++;}
	if($event == 'other'){$i++;}
	if($event != 'none' && $event != 'other'){$i++;}
	if(trim($heightStyle) != 'none'){$i++;}
	if($animate != 'none'){$i++;}
    if($animate_show != 'none'){$i++;}
?>
<?php if(($active = trim($active)) != ''):?>
		active: <?=$active?><?=--$i > 0 ? ',' : ''?>
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
<?php if(trim($heightStyle) != 'none'):?>

		heightStyle: "<?=trim($heightStyle)?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'false'):?>

		hide: <?='false'?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'time'):?>

		hide: <?=$animate_time?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'effect'):?>

		hide: "<?=$animate_effect?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate == 'object'):?>

		hide: {
            effect: "<?=$animate_effect_obj?>",
            delay: <?=$animate_delay_obj?>,
            duration: <?=$animate_time_obj?>,
			easing: "<?=$animate_type_obj?>"
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate_show == 'false'):?>

		show: <?='false'?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate_show == 'time'):?>

		show: <?=$animate_show_time?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate_show == 'effect'):?>

		show: "<?=$animate_show_effect?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($animate_show == 'object'):?>

		show: {
            effect: "<?=$animate_show_effect_obj?>",
            delay: <?=$animate_show_delay_obj?>,
            duration: <?=$animate_show_time_obj?>,
			easing: "<?=$animate_show_type_obj?>"
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>

	});
});
/*Конец аккордеона "<?=$name?>"*/