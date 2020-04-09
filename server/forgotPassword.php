<?php
	include("globals.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']) || isset($_POST['Email']))
	{
        //Incoming variables
        if(isset($_POST['MurdochUserNumber']))
            $id = $_POST['MurdochUserNumber'];

        if(isset($_POST['Email']))
		    $email = $_POST['Email'];
		
		$con = connectToDb();
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ? OR Email = ?");
		$stmt->bind_param("ss", $id, $email);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();

		
		if($result && $result->num_rows > 0)
		{
            $data = $result->fetch_assoc(); //Get first fow
			$now = strtotime(date('G:i:s'));
            
            $tokenExpiration = strtotime($data['TokenExpireTime']);
            $tokenSaved = $data['Token'];
            
            if($tokenSaved != "" && $now < $tokenExpiration)
			{
					$reply->Status = 'fail';
					$reply->Message = "An email was sent to you. Please follow the link to reset your password.";
					
            }	
            else
            {
                //Generate a random string.
                $token = bin2hex(openssl_random_pseudo_bytes(16));
                //strtotime will convert time into an integer, so we can easily add seconds to it (expirationSeconds is defined in dbConnection, where other globals are)
                $TokenExpireTime = strtotime(date('G:i:s')) + $expirationSeconds; 
                // However, in the database we save time im format hh:mm:ss, so this convert the time back to that format
                $TokenExpireTimeFormat = date("G:i:s",$TokenExpireTime); 

                $tempPsw = bin2hex(openssl_random_pseudo_bytes(6));
                //Save to db
                $stmt = $con->prepare("update user set Password = ?, PasswordResetRequired = 1, Token = ?, TokenExpireTime = ? WHERE  MurdochUserNumber = ?");	
                $stmt->bind_param("ssss", $tempPsw,$token, $TokenExpireTimeFormat, $data['MurdochUserNumber']);
                $stmt->execute();

                $link =  $serverAddress . 'web/resetPassword.html?' . $data['MurdochUserNumber'] . '&' . $token;
                $emailBody = "Reset your password link: " . $link . "\n\nUse " . $tempPsw . " as your old password";
                sendEmail($data['Email'], "Password reset requested", $emailBody );

                $reply->Status = 'ok';
                $reply->Message = "An email was sent to your nominated address.";
                $reply->Data = $emailBody;
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
        mysqli_close($con);			
    }
    else
    {
        echo 'wtf';
    }

?>