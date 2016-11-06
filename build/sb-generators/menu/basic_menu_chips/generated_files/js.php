/*Начало "Базовых фишек" для меню "<?=$name?>"*/
$(function() {
	$( "<?=trim($selector)?>" ).basicMenuChips({
<?php
	$i = 0;
	if($full_width == 'true'){$i++;}
    if($fixed == 'true'){$i++;}
    if($scroll_target == 'false'){$i++;}
    if($active_from_target == 'false'){$i++;}
    if($slider == 'true'){$i++;}
    
    if(($menu_wrap = trim($menu_wrap)) != ''){$i++;}
    if(($menu_items = trim($menu_items)) != ''){$i++;}
    if(($select_width_menu_items = trim($select_width_menu_items)) != ''){$i++;}
    if(($menu_items_and_sub_menu = trim($menu_items_and_sub_menu)) != ''){$i++;}
    if(($width_factor = trim($width_factor)) != ''){$i++;}
    if(($duration = trim($duration)) != ''){$i++;}
    if($easing != 'swing'){$i++;}
    if($accounting_menu_height != 'default'){$i++;}
    if($delete_class_active_no_focus_targets_block == 'true'){$i++;}
    if($vertical == 'true'){$i++;}
?>
<?php if($full_width == 'true'):?>

		fullWidth: <?=$full_width?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($fixed == 'true'):?>

		fixed: <?=$fixed?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($scroll_target == 'false'):?>

		scrollTarget: <?=$scroll_target?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($active_from_target == 'false'):?>

		activeFromTarget: <?=$active_from_target?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($slider == 'true'):?>

		slider: <?=$slider?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($menu_wrap = trim($menu_wrap)) != ''):?>

		menuWrap: <?=$menu_wrap?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($menu_items = trim($menu_items)) != ''):?>

		menuItems: <?=$menu_items?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($select_width_menu_items = trim($select_width_menu_items)) != ''):?>

		selectWidthMenuItems: <?=$select_width_menu_items?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($menu_items_and_sub_menu = trim($menu_items_and_sub_menu)) != ''):?>

		menuItemsAndSubMenu: <?=$menu_items_and_sub_menu?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($width_factor = trim($width_factor)) != ''):?>

		widthFactor: <?=$width_factor?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if(($duration = trim($duration)) != ''):?>

		widthFactor: <?=$duration?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($easing != 'swing'):?>

		easing: <?=$easing?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($easing != 'swing'):?>

		easing: <?=$easing?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>

<?php if($accounting_menu_height == 'false'):?>

		accountingMenuHeight: false<?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($accounting_menu_height == 'number'):?>

		accountingMenuHeight: <?=$accounting_menu_height_num?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($accounting_menu_height == 'function'):?>

		accountingMenuHeight: <?=$accounting_menu_height_fn?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($delete_class_active_no_focus_targets_block == 'true'):?>

		deleteClassActiveNoFocusTargetsBlock: <?=$delete_class_active_no_focus_targets_block?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>
<?php if($vertical == 'true'):?>

		vertical: <?=$vertical?><?=--$i > 0 ? ',' : ''?>
<?php endif;?>

	});
});
/*Конец "Базовых фишек" для меню "<?=$name?>"*/