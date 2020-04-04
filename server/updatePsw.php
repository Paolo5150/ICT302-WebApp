<?php

	include("dbConnection.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Password']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
		$psw = $_POST['Password'];
		
		$con = connectToDb();

		
		//Prepare SQL statement. Place a '?' where you want to pass an argument
		// Below I'm passing the student ID
		$stmt = $con->prepare("update user set Password = ? WHERE  MurdochUserNumber = ?");
		
		
		// This is where I'm passing the actual argument

		$stmt->bind_param("si", $psw, $id );
		
		// Execute the SQL statement
		$status = $stmt->execute();
		
		//Check if we got something	
		$stmt->get_result();
		
		
		if($status)
		{
			// If ok, activate account
			$stmt = $con->prepare("update user set AccountActive = 1 WHERE  MurdochUserNumber = ?");
			$stmt->bind_param("i", $id );
			$stmt->execute();
			echo 'ok';
		}
		else
		{
			echo 'fail';
		}
	}

?>