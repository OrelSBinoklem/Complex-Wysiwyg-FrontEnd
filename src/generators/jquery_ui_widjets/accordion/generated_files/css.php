/*Начало аккордеона "<?=$name?>"*/
<?php if(trim($pre_selector) != ''):?>
<?=trim($pre_selector)?> {
<?php endif;?>
<?php if($icons == 'custom_font'):?>
<?php
	$norm_gly = substr($custom_font_header, 0, 3) == 'gly';
	$norm_fa = substr($custom_font_header, 0, 3) == 'fa-';
	$active_gly = substr($custom_font_activeHeader, 0, 3) == 'gly';
	$active_fa = substr($custom_font_activeHeader, 0, 3) == 'fa-';
?>
<?php if($norm_gly || $active_gly):?>
<?php if($norm_gly):?>
<?=$idclass_accordion?> .ui-icon.<?=$custom_font_header?><?=$active_gly ? ',' : ''?>
<?php endif;?>
<?php if($active_gly):?>
<?=$idclass_accordion?> .ui-icon.<?=$custom_font_activeHeader?>
<?php endif;?> {
	font-size: 14px;
	text-align: center;
	font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
	background-image: none;
    -webkit-font-smoothing: antialiased;
}
<?php elseif($norm_fa || $active_fa):?>
<?php if($norm_fa):?>
<?=$idclass_accordion?> .ui-icon.<?=$custom_font_header?><?=$active_fa ? ',' : ''?>
<?php endif;?>
<?php if($active_fa):?>
<?=$idclass_accordion?> .ui-icon.<?=$custom_font_activeHeader?>
<?php endif;?> {
	font-size: 14px;
	text-align: center;
	font: normal normal normal 14px/1 FontAwesome;
    text-rendering: auto;
	background-image: none;
    -webkit-font-smoothing: antialiased;
}
<?php endif;?>
<?php endif;?>
<?php if($icons == 'custom_image'):?>
<?=$idclass_accordion?> .ui-accordion-header .ui-accordion-header-icon {
<?php foreach(normal_tabs($custom_image) as $line):?>
	<?=$line?>
<?php endforeach;?>

    background: url("<?=$base_url_full . $icons_img_src?>") 0 0 no-repeat;
    width: <?=$icons_img_w?>px;
    height: <?=round((int)$icons_img_h / 2)?>px;
	margin-top: -<?=round((int)$icons_img_h / 4)?>px;
}

<?=$idclass_accordion?> .ui-accordion-header.ui-state-active .ui-accordion-header-icon {
    background-position: 0 -<?=round((int)$icons_img_h / 2)?>px;
}
<?php endif;?>
<?php if($icons == 'disabled'):?>
<?=$idclass_accordion?> .ui-accordion-header .ui-accordion-header-icon {
    display: none;
}
<?php endif;?>
<?php if(trim($container_css) != ''):?>
<?=$idclass_accordion?> {
<?php foreach(normal_tabs($container_css) as $line):?>
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