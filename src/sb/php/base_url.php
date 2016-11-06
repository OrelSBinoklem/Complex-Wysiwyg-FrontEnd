<?php
    $base_url = '';
    $base_url = $_SERVER['REQUEST_URI'];
    preg_match('/^(.*)sb.php$/', $base_url, $base_url);
    echo $base_url[1];
?>