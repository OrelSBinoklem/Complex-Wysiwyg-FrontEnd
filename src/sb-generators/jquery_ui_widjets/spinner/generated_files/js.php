/*Начало аккордеона "<?=$name?>"*/
$(function() {
	$( "<?=trim($pre_selector . " " . $idclass_accordion . " input")?>" ).spinner({
<?php
	$i = 0;
	if(($culture = trim($culture)) != ''){$i++;}
    if($disabled == 'true'){$i++;}
    if($icons == 'jquery'){$i++;}
	if($icons == 'custom_font'){$i++;}
    if(($min = trim($min)) != ''){$i++;}
    if(($max = trim($max)) != ''){$i++;}
    if(($number_format = trim($number_format)) != ''){$i++;}
    if(($page = trim($page)) != ''){$i++;}
    if(($step = trim($step)) != ''){$i++;}
?>
<?php if(($culture = trim($culture)) != ''):?>

		culture: "<?=$culture?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($disabled == 'true'):?>

		disabled: <?=$disabled?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($icons == 'jquery'):?>

		icons: {
<?php if(trim($icons_header) != ''):?>

			down: "<?=trim($icons_header)?>"<?=trim($icons_up) != '' > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($icons_up) != ''):?>

			up: "<?=trim($icons_up)?>"
<?php endif;?>
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($icons == 'custom_font'):?>

		icons: {
<?php if(trim($custom_font_header) != ''):?>

			down: "<?=trim($custom_font_header)?>"<?=trim($custom_font_activeHeader) != '' > 0 ? ',' : ''?>
<?php endif;?>
<?php if(trim($custom_font_activeHeader) != ''):?>

			up: "<?=trim($custom_font_activeHeader)?>"
<?php endif;?>
		}<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($min = trim($min)) != ''):?>

		min: <?=$min?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($max = trim($max)) != ''):?>

		max: <?=$max?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($number_format = trim($number_format)) != ''):?>

		numberFormat: "<?=$number_format?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($page = trim($page)) != ''):?>

		page: <?=$page?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($step = trim($step)) != ''):?>

		step: <?=$step?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>

	});
});
/*Конец аккордеона "<?=$name?>"*/