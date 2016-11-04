<?php
    $base_url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    preg_match('/^(.*)shablonizator.php$/', $base_url, $base_url);
    echo $base_url[1];
?>