/*Начало меню "<?=$name?>"*/
<?=$idclassmenu?> {
	height: <?=$height . $heightunit?>;
    overflow: hidden;

    ul {
<? if($centermenu == 'center'): ?>
		position: relative;
		left: 50%;
		float: left;
<? endif; ?>
        height: 100%;
        list-style: none;
    }

    li {
        float: left;
        height: 100%;
<? if($centermenu == 'center' || $imgsepar == 'image-separate-container'): ?>
		position: relative;
<? endif; ?>
<? if($centermenu == 'center'): ?>
		left: -50%;
<? endif; ?>
    }

    li + li {
        margin-left: <?=$ml_puncts . $ml_punctsunit?>;
    }
    
<? if($imgsepar == 'image-separate-container'): ?>
	li + li:before {
		content: '';
		width: <?=$imgsepar_w . 'px' ?>;
		height: <?=$imgsepar_h . 'px' ?>;
		position: absolute;
		top: <?=$imgsepar_t . 'px' ?>;
		right: <?=$imgsepar_r . 'px' ?>;
		background: url("<?=$base_url_full . $imgsepar_src; ?>") 0 0 no-repeat;
	}
<? endif; ?>
    a {
        display: block;
    	text-decoration: none;
    	outline: none;
    	cursor: pointer;
        height: 100%;
    }
}
/*Конец меню "<?=$name?>"*/