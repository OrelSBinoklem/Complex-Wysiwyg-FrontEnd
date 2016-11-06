/*Начало ползунка "<?=$name?>"*/
$(function() {
	$( "<?=trim($pre_selector . " " . $idclass_accordion)?>" ).slider({
<?php
	$i = 0;
	if(($animate_time = trim($animate_time)) != ''){$i++;}
    if($disabled == 'true'){$i++;}
    if(($min = trim($min)) != ''){$i++;}
    if(($max = trim($max)) != ''){$i++;}
    if($orientation == 'vertical'){$i++;}
    if($range != 'none'){$i++;}
    if(($step = trim($step)) != ''){$i++;}
    if(($one_value = trim($one_value)) != ''){$i++;}
    if(($values = trim($values)) != ''){$i++;}
?>
<?php if(($animate_time = trim($animate_time)) != ''):?>
		animate: <?=$animate_time?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($disabled == 'true'):?>

		disabled: <?=$disabled?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($min = trim($min)) != ''):?>

		min: <?=$min?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($max = trim($max)) != ''):?>

		max: <?=$max?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($orientation == 'vertical'):?>

		orientation: "<?=$orientation?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($range == 'true'):?>

		range: <?=$range?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($range == 'min' || $range == 'max'):?>

		range: "<?=$range?>"<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($step = trim($step)) != ''):?>

		step: <?=$step?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($one_value = trim($one_value)) != ''):?>

		value: <?=$one_value?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($values = trim($values)) != ''):?>

		values: [<?=$values?>]<?=--$i > 0 ? ',' : ''?>
<?php endif;?>

	});
});
/*Конец ползунка "<?=$name?>"*/