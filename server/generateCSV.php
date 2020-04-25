<?php

    include("../server/globals.php");
    include("../server/functions.php");
    //config
    $namefile = "test.txt";
    $myfile = fopen($namefile, "w") or die("Unable to open file!");
    $txt = "John Doe\n";
    fwrite($myfile, $txt);
    $txt = "Jane Doe\n";
    fwrite($myfile, $txt);
    fclose($myfile);

    //header download
    ob_clean();
    $file_url = $serverAddress . "server/" .$namefile;
    header("Pragma: public");
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
    header('Cache-Control: private',false);
    header("Content-Type: application/force-download");
    header("Content-Disposition: attachment;filename={$file_url} ");
    header("Content-Transfer-Encoding: binary ");
    header('Content-Length: '.filesize($file_url));
    header('Connection: close');
    flush();
      readfile($file_url);




?>