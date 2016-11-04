<?php
    if(substr($idclassmenu, 0, 1) == '.')
    {
        $idClass = ' class="' . substr($idclassmenu, 1) . '"';
    }
    else
    {
        $idClass = ' id="' . substr($idclassmenu, 1) . '"';
    }
?>
<!--Начало меню "<?=$name?>"-->
<div<?=$idClass?>>
    <ul>
<?php only_array($puncts_text); ?>
<?php foreach($puncts_text as $key => $value):?>
        <li><a href="#"><?=$value?></a></li>
<?php endforeach;?>
    </ul>
    <div class="clear"></div>
</div>
<!--Конец меню "<?=$name?>"-->