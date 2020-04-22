<?php
	include("globals.php");
	include("functions.php");

    	//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();
    if(isset($_POST['MurdochUserNumber']) && isset($_POST["Token"]) && isset($_POST["AdminMUS"]) && isset($_POST["AdminFName"]) && isset($_POST["AdminLName"]) && isset($_POST["AdminEmail"]))
	{
        $id = $_POST['MurdochUserNumber'];
        $token = $_POST['Token'];

		$con = connectToDb();
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ? AND Token = ?");
		$stmt->bind_param("ss", $id, $token);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();

		
		if($result && $result->num_rows > 0)
		{
            $stmt = $con->prepare("INSERT INTO user (MurdochUserNumber, FirstName, LastName, Email, Password, IsAdmin, PasswordResetRequired, AccountActive) VALUES (?, ?, ?, ?, 'admin', 1, 1, 0)");
            $stmt->bind_param("ssss", $_POST["AdminMUS"], $_POST["AdminFName"], $_POST["AdminLName"], $_POST["AdminEmail"]);
            $stmt->execute();
            
            //Generate a random string.
            $token = bin2hex(openssl_random_pseudo_bytes(16));

            $now = date("Y-m-d H:i:s");		 
            //strtotime will convert time into an integer, so we can easily add seconds to it (expirationSeconds is defined in dbConnection, where other globals are)
            $TokenExpireTime = strtotime('+0 days', strtotime($now)) + $expirationSeconds; 
            // However, in the database we save time im format hh:mm:ss, so this convert the time back to that format
            $TokenExpireTimeFormat = date('Y-m-d H:i:s', $TokenExpireTime);
            //Save to db
            $stmt = $con->prepare("update user set Token = ?, TokenExpireTime = ? WHERE  MurdochUserNumber = ?");	
            $stmt->bind_param("sss", $token, $TokenExpireTimeFormat, $_POST["AdminMUS"]);
            $stmt->execute();

            $link =  $serverAddress . 'web/resetPassword.html?' . $_POST["AdminMUS"] . '&' . $token;
            sendEmail($_POST["AdminEmail"], "Password reset required", "Reset your password link: " . $link);
            $reply->Status = 'ok';
            $reply->Message = 'Amind user created. Default password "admin", a password reset will be required.';
        }
        else
        {
            $reply->Status = 'fail';
            $reply->Message = 'User not found';
        }       
        
    }
    else
    {
        $reply->Status = 'fail';
        $reply->Message = 'Values not set';
    }

    $myJSON = json_encode($reply);			
	echo $myJSON;

?>