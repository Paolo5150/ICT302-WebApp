<?php

	include("dbConnection.php");

    if(isset($_POST['MurdochUserNumber']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];


		$con = connectToDb();

		// Check token

		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
		$stmt->bind_param("i", $id);
		$stmt->execute();
		$result = $stmt->get_result();

		$reply = new stdClass();

		if($result && $result->num_rows > 0)
		{
			$data = $result->fetch_assoc(); //Get row		
			$reply->Status = 'ok';
			$reply->Data = new stdClass();

			$reply->Data->FirstName = $data['FirstName'];
			$reply->Data->LastName = $data['LastName'];
			$reply->Data->Email = $data['Email'];
			$reply->Data->MUN = $data['MurdochUserNumber'];
			$reply->Data->UserID = $data['UserID'];
			$reply->Data->PasswordResetRequired = $data['PasswordResetRequired'];
			$reply->Data->AccountActive = $data['AccountActive'];
			$reply->Data->IsAdmin = $data['IsAdmin'];

			// Add additional info about the status of the token
			$tokenExpiration = strtotime($data['TokenExpireTime']);
			$token = $data['Token'];

			$now = strtotime(date('G:i:s'));
			if($token == "" || $now > $tokenExpiration)
				$reply->Data->TokenValid = false;
			else
			$reply->Data->TokenValid = true;
		}
		else
		{
			$reply->Status = 'ok';
			$reply->Data = 'User not found';
		}

		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;
	}

?>