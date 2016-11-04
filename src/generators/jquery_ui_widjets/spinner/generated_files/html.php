<?php
    if(substr($idclass_accordion, 0, 1) == '.')
    {
        $idClass = ' class="' . substr($idclass_accordion, 1) . '"';
    }
    else
    {
        $idClass = ' id="' . substr($idclass_accordion, 1) . '"';
    }
?>
<!--Начало спиннера "<?=$name?>"-->
<span<?=$idClass?>><input value=""></span>
<!--Конец спиннера "<?=$name?>"-->