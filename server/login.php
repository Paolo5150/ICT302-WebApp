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
			$reply->Data->PasswordResetRequired = $data['PasswordResetRequired'];
			$reply->Data->AccountActive = $data['AccountActive'];

			// If password reset is not required, still check
			if($reply->Data->PasswordResetRequired == 0)
			{
				// Check token
				// If there is a token set but it's expired,
				// that means that the user got the email to activate account but didn't use it on time
				// So, set PasswordResetRequired to true so they will get another email

				//Get user details
				$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
				$stmt->bind_param("s", $id);
				$stmt->execute();
				$result = $stmt->get_result();
				if($result && $result->num_rows > 0)
				{
					$data = $result->fetch_assoc(); //Get first fow
					$tokenExpiration = strtotime($data['TokenExpireTime']);
					$tokenSaved = $data['Token'];
					$now = strtotime(date('G:i:s'));
					
					//If the token waws set and is expired, require password reset
					if($tokenSaved != "" && $now > $tokenExpiration)
					{
						$stmt = $con->prepare("update user set PasswordResetRequired = 1 WHERE  MurdochUserNumber = ?");
						$reply->Data->PasswordResetRequired = 1;	
						$stmt->bind_param("i", $id);
						$stmt->execute();			
					}
				}
			}

			// If password reset is reuqired, send email
			if($reply->Data->PasswordResetRequired == 1)
			{
				//Generate a random string.
				$token = bin2hex(openssl_random_pseudo_bytes(16));
				//strtotime will convert time into an integer, so we can easily add seconds to it (expirationSeconds is defined in dbConnection, where other globals are)
				$TokenExpireTime = strtotime(date('G:i:s')) + $expirationSeconds; 
				// However, in the database we save time im format hh:mm:ss, so this convert the time back to that format
				$TokenExpireTimeFormat = date("G:i:s",$TokenExpireTime); 
				//Save to db
				$stmt = $con->prepare("update user set Token = ?, TokenExpireTime = ? WHERE  MurdochUserNumber = ?");	
				$stmt->bind_param("sss", $token, $TokenExpireTimeFormat, $id);
				$stmt->execute();

				$link =  $serverAddress . 'web/resetPassword.html?' . $reply->Data->MUN . '&' . $token;
				sendEmail($reply->Data->Email, "Password reset required", "Reset your password link: " . $link);
				// Update PasswordResetRequired in daabase
				$stmt = $con->prepare("update user set PasswordResetRequired = 0 WHERE  MurdochUserNumber = ?");
				$stmt->bind_param("i", $id );
				$stmt->execute();
			}
			
		
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "User not found";
		}
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;
			
	}

?>