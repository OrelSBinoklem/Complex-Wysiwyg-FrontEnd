<?php
$update_neded = "";
if(preg_match("/change-content|full_js|full-update/im", $zapros))
{
    $update_neded = "true";
}
?>
    
<style mode="less">
<?php
include("generated_files/css.php");
?>
</style>
<script mode="js">
<?php
include("generated_files/js.php");
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
	<file data-url="shablonizator/generators/menu/basic_menu_chips/lib_files/basic_menu_chips/basic_menu_chips.css" data-selected="true" />
    <file data-url="shablonizator/generators/menu/basic_menu_chips/lib_files/basic_menu_chips/basic_menu_chips.js" data-selected="true" />
</dataready>