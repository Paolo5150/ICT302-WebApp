<?php

date_default_timezone_set('Australia/Perth');
$serverAddress = 'http://localhost/ict302-webapp/';
$expirationSeconds = 1800; // 30 minutes
function connectToDb()
{
	$databaseName = 'ict302';
	$databasePassword = '';
	$databaseUsername = 'root';
	$databaseAddress = 'localhost';
	$con = mysqli_connect($databaseAddress,$databaseUsername,$databasePassword,$databaseName);
	return $con;
}

?>