<?php
$update_neded = "";
if(preg_match("/change-content|full_js|full-update/im", $zapros))
{
    $update_neded = "true";
}
?>
<?php if($update_neded == "true" || $zapros == "start"):?>
    <dataready mode="html" data-selector="<?=$container?>" data-relatively="<?=$container_pos?>" data-selector-clear="<?=trim($container . " " . $idclassmenu)?>" data-neded-update="<?=$update_neded?>">
        <?php
        include("generated_files/html.php");
        ?>
    </dataready>
<?php endif;?>
    
<style mode="less">
<?php
include("generated_files/css.php");
?>
</style>
<script mode="js">
<?php

?>
function rebootNeeded(zapros)
{
    var re_not = /css|change-content|full_js/gim;
    if(re_not.test(zapros))
    {
        return false;
    }
    return true;
}
function GCupdater(zapros)
{
    
}
</script>
<dataready mode="insert">
	<file data-url="shablonizator/generators/libraries_plugins/jquery/jquery-1.11.2.min.js" data-selected="" />
</dataready>