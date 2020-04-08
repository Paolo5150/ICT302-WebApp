<?php
	session_start();
	include("globals.php");
	include("dbConnection.php");
	include("email.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Password']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
		$psw = $_POST['Password'];
		
		$con = connectToDb();

		//Prepare SQL statement. Place a '?' where you want to pass an argument
		// Below I'm passing the student ID
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
		
		// This is where I'm passing the actual argument
		$stmt->bind_param("s", $id);
		
		// Execute the SQL statement!
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		$reply->Data = new stdClass();

		
		if($result && $result->num_rows > 0)
		{
			$now = strtotime(date('G:i:s'));

			$data = $result->fetch_assoc(); //Get first fow

			//Get token, used later
			$tokenExpiration = strtotime($data['TokenExpireTime']);
			$tokenSaved = $data['Token'];
			//Check password
			$pswSaved = $data['Password'];
			//Try to decrypt
			$pswDec = encrypt_decrypt('d',$pswSaved);
			$paswOK = true;


			// First thing, check if a password reset was requested
			if($data['PasswordResetRequired'] == 1)
			{
				//If the token is still alive
				if($tokenSaved != "" && $now < $tokenExpiration)
				{
					$reply->Status = 'fail';
					$reply->Message = "Please check your email";					
					
				}	
				else
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

					$link =  $serverAddress . 'web/resetPassword.html?' . $data['MurdochUserNumber'] . '&' . $token;
					sendEmail($data['Email'], "Password reset required", "Reset your password link: " . $link);		

					$reply->Status = 'fail';
					$reply->Message = "PASSWORD RESET REQUIRED: An email has been sent to you, please follow the link to reset your password.";
					//TODO: remove this data before shipping (not urgent though)
					$reply->Data = $token;
				}
	
			}
			else
			{
				//If account not acative
				if($data['AccountActive'] == 0)
				{
				
					//If the token is still alive
					if($tokenSaved != "" && $now < $tokenExpiration)
					{
						$stmt = $con->prepare("update user set PasswordResetRequired = 1 WHERE  MurdochUserNumber = ?");
						$reply->Data->PasswordResetRequired = 1;	
						$stmt->bind_param("i", $id);
						$stmt->execute();		

						$reply->Status = 'fail';
						$reply->Message = "Your account is not active. Please check your email and activate your account.";					
						
					}	
					//If the token is set but expired, send a new link
					if($tokenSaved != "" && $now > $tokenExpiration)
					{
						//Generate a random string.
						$token = bin2hex(openssl_random_pseudo_bytes(16));
						//strtotime will convert time into an integer, so we can easily add seconds to it (expirationSeconds is defined in dbConnection, where other globals are)
						$TokenExpireTime = strtotime(date('G:i:s')) + $expirationSeconds; 
						// However, in the database we save time im format hh:mm:ss, so this convert the time back to that format
						$TokenExpireTimeFormat = date("G:i:s",$TokenExpireTime); 
						//Save to db
						$stmt = $con->prepare("update user set PasswordResetRequired = 1, Token = ?, TokenExpireTime = ? WHERE  MurdochUserNumber = ?");	
						$stmt->bind_param("sss", $token, $TokenExpireTimeFormat, $id);
						$stmt->execute();

						$link =  $serverAddress . 'web/resetPassword.html?' . $data['MurdochUserNumber'] . '&' . $token;
						sendEmail($data['Email'], "Password reset required", "Reset your password link: " . $link);
			
						$reply->Status = 'fail';
						$reply->Message = "PASSWORD RESET REQUIRED: An email has been sent to you, please follow the link to reset your password.";
					}	
					else
					{
						$reply->Status = 'fail';
						$reply->Message = "Your account is no longer active.";
					}
				}
				else if($data['AccountActive'] == 1) //If the account is active
				{
					// If fails to decrypt, compare with unencrypted password
					if($pswDec == false)
					{
						if($pswSaved != $psw)
							$paswOK = false;
					}
					else
					{
						if($pswDec != $psw)
							$paswOK = false;
					}

					if($paswOK == false)
					{
						$reply->Status = 'fail';
						$reply->Message = 'Password incorrect';
					}
					else
					{
						// Set cookies and session variables if the login is not coming from the simulation
						if(!isset($_POST['IsSim']))
						{
								//Generate a random string.
							$token = bin2hex(openssl_random_pseudo_bytes(16));
							//Save to db
							$stmt = $con->prepare("update user set Token = ? WHERE  MurdochUserNumber = ?");	
							$stmt->bind_param("ss", $token, $id);
							$stmt->execute();
				
							$_SESSION['MurdochUserNumber'] = $id;
							$_SESSION['Token'] = $token;
							setcookie("MurdochUserNumber", $id, time() + $cookieExpiration, "/"); // 86400 = 1 day
							setcookie("Token", $token, time() + $cookieExpiration, "/"); // 86400 = 1 day
						}
						

						$reply->Status = 'ok';
						$reply->Data->FirstName = $data['FirstName'];
					}	
					
				}
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