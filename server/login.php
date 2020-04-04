<?php

	include("dbConnection.php");
	include("email.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Password']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
		$psw = $_POST['Password'];
		
		$con = connectToDb();

		//Prepare SQL statement. Place a '?' where you want to pass an argument
		// Below I'm passing the student ID
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ? AND Password = ? ");
		
		// This is where I'm passing the actual argument

		$stmt->bind_param("ss", $id, $psw);
		
		// Execute the SQL statement
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		
		
		if($result && $result->num_rows > 0)
		{
			$data = $result->fetch_assoc(); //Get first fow
			
			$reply->Status = 'ok';			

			$reply->Data = new stdClass();
			$reply->Data->FirstName = $data['FirstName'];
			$reply->Data->LastName = $data['LastName'];
			$reply->Data->Email = $data['Email'];
			$reply->Data->MUN = $data['MurdochUserNumber'];
			$reply->Data->UserID = $data['UserID'];
			$reply->Data->FirstLoginComplete = $data['FirstLoginComplete'];
			$reply->Data->AccountActive = $data['AccountActive'];

			if($reply->Data->FirstLoginComplete == false)
			{
				$link =  $serverAddress . 'web/resetPassword.html?' . $reply->Data->MUN;
				sendEmail($reply->Data->Email, "Password reset required", "Reset your password link: " . $link);
				// Update FirstLogin in daabase
				$stmt = $con->prepare("update user set FirstLoginComplete = 1 WHERE  MurdochUserNumber = ?");
				$stmt->bind_param("i", $id );
				$stmt->execute();
			}
			
		
		}
		else
		{
			$reply->Status = 'fail';
		}
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;
			
	}

?>