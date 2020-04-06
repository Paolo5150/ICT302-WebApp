<?php

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