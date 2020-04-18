<?php
	include("globals.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']) || isset($_POST['Token']))
	{
        //Incoming variables
         $id = $_POST['MurdochUserNumber'];
         $token = $_POST['Token'];
		
		$con = connectToDb();
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ? AND Token = ?");
		$stmt->bind_param("ss", $id, $token);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();

		
		if($result && $result->num_rows > 0)
		{
            $data = $result->fetch_assoc(); //Get first fow
			$now = date("Y-m-d H:i:s");
            
            $tokenExpiration = $data['TokenExpireTime'];
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
	 

                $TokenExpireTime = strtotime('+0 days', strtotime($now)) + $expirationSeconds; 
                $TokenExpireTimeFormat = date('Y-m-d H:i:s', $TokenExpireTime); 

                //Save to db
                $stmt = $con->prepare("update user set Token = ?, TokenExpireTime = ?, PasswordResetRequired = 1 WHERE  MurdochUserNumber = ?");	
                $stmt->bind_param("sss", $token, $TokenExpireTimeFormat, $data['MurdochUserNumber']);
                $stmt->execute();

                $link =  $serverAddress . 'web/resetPassword.html?' . $data['MurdochUserNumber'] . '&' . $token;
                $emailBody = "<p>Reset your password link: " . $link . "</p>";
                sendEmail($data['Email'], "Password reset requested", $emailBody );

                $reply->Status = 'ok';
                $reply->Message = "An email was sent to your nominated address.";

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
?>