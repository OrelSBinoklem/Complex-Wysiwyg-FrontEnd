<?php
$update_neded = "";
if(preg_match("/change-content|full_js|full-update/im", $zapros))
{
    $update_neded = "true";
}
?>
<?php if($update_neded == "true" || $zapros == "start"):?>
    <dataready mode="html" data-selector="<?=$container?>" data-relatively="<?=$container_pos?>" data-selector-clear="<?=trim($container . " " . $idclass_accordion)?>" data-neded-update="<?=$update_neded?>">
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
//Костыль
$pre_selector_temp = $pre_selector;
$pre_selector = $container;
//
include("generated_files/js.php");
//
$pre_selector = $pre_selector_temp;
//
?>
function rebootNeeded(zapros)
{
    var re_not = /css|change-content|full_js|active|disabled|event/gim;
    if(re_not.test(zapros))
    {
        return false;
    }
    return true;
}
function GCupdater(zapros)
{
    switch(zapros){
        case "active":
            $( "<?=trim($container . " " . $idclass_accordion)?>" ).accordion( "option", "active", <?=$active?> );
            break;
        case "full_js":
            <?php
            //Костыль
            $pre_selector_temp = $pre_selector;
            $pre_selector = $container;
            //
            include("generated_files/js.php");
            //
            $pre_selector = $pre_selector_temp;
            //
            ?>
            break;
        case "disabled":
            $( "<?=trim($container . " " . $idclass_accordion)?>" ).accordion( "option", "disabled", <?=$disabled?> );
            break;
        case "event":
            <?php if($event == 'other'):?>
            	$( "<?=trim($container . " " . $idclass_accordion)?>" ).accordion( "option", "event", "<?=$event_other?>" );
            <?php else:?>
                $( "<?=trim($container . " " . $idclass_accordion)?>" ).accordion( "option", "event", "<?=$event?>" );
            <?php endif;?>
            break;
    }
}
</script>
<dataready mode="insert">
	<!--<file data-url="shablonizator/generators/libraries_plugins/jquery/jquery-1.11.2.min.js" data-selected="" />-->
</dataready>