<?php
	session_start();
	include("globals.php");
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
		
			$data = $result->fetch_assoc(); //Get first fow

			//Check password
			$pswSaved = $data['Password'];
			//Try to decrypt
			$pswDec = encrypt_decrypt('d',$pswSaved);
			$paswOK = true;
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
			else //Password OK!
			{

				// First thing, check if a password reset was requested
				if($data['PasswordResetRequired'] == 1)
				{
					$reply->Status = 'fail';
					$link = "Click on this link to reset your password: <a target='_blank' href='${serverAddress}web/resetPassword.html'>RESET PASSWORD</a>";
					$reply->Message = $link;				

		
				}
				else
				{
					//If account not acative
					if($data['AccountActive'] == 0)
					{
						$reply->Status = 'fail';
						$reply->Message = "Account not active";
					}
					else if($data['AccountActive'] == 1) //If the account is active
					{
						$reply->Status = 'ok';
						$reply->Data->FirstName = $data['FirstName'];
						$reply->Data->LastName = $data['LastName'];
						$reply->Data->MurdochUserNumber = strval($data['MurdochUserNumber']);

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
							setcookie("MurdochUserNumber", $id, time() + $cookieExpiration, "/");
							setcookie("Token", $token, time() + $cookieExpiration, "/");
							$reply->Data->Token = $token;

						}
						
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