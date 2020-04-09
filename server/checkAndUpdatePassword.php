<?php
	include("globals.php"); 
    include("functions.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Password']) && isset($_POST['Confirm']) && isset($_POST['OldPassword']) && isset($_POST['Token']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
        $psw = $_POST['Password'];
        $confirm = $_POST['Confirm'];
        $oldPsw = $_POST['OldPassword'];
        $token = $_POST['Token'];
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
            // Add additional info about the status of the token
			$tokenExpiration = strtotime($data['TokenExpireTime']);
			$tokenSaved = $data['Token'];

            $now = strtotime(date('G:i:s'));

            $reply->Status = 'fail';            
            if($token != $tokenSaved || $now > $tokenExpiration)
            {
                $reply->Message = 'Link has expired';
            }
            else if($oldPsw != $data['Password'])
            {
                $reply->Message = 'Old password incorrect';
            }
            else if($psw == "" || $confirm == "" || $oldPsw == "")
            {
                $reply->Message = 'Empty fields not allowed';
            }
            else if(!IsPasswordGoodEnough($psw))
            {
                $reply->Message = 'Password not strong enough';
            }
            else if($psw != $confirm)
            {
                $reply->Message = 'Passwords not matching';
            }
            else
            {
                $pswEnc = encrypt_decrypt('e',$psw);
                //Update password, reset token (IMPORTANT)
				$stmt = $con->prepare("update user set Password = ?, PasswordResetRequired = 0 ,Token = '', TokenExpireTime = '' WHERE  MurdochUserNumber = ?");
				$stmt->bind_param("si", $pswEnc, $id );
				$status = $stmt->execute();
				$stmt->get_result();	
				
				if($status)
				{
					// If ok, activate account
					$stmt = $con->prepare("update user set AccountActive = 1 WHERE  MurdochUserNumber = ?");
					$stmt->bind_param("i", $id );
                    $stmt->execute();
                    
                    $reply->Status = 'ok';
                    $reply->Message = 'Password accepted';
					
				}
				else
				{
					$reply->Status = 'fail';
                    $reply->Message = 'Internal error occurred';
				}
            }

        }
		else
		{
			$reply->Status = 'fail';
			$reply->Message = 'User not found';
		}

		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;
    }
    
    function IsPasswordGoodEnough($psw)
    {
        $result = true;
        if(strlen($psw) < 8)
            $result = false;
        
        //At least one number
        $foundNum = false;
        for($i=0; $i< strlen($psw); $i++)
        {
            if(is_numeric($psw[$i]))
                $foundNum = true;
        }

        if(!$foundNum)
            $result = false;

            // At least one special char
        if (!preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $psw))        
            $result = false;            
        
        return $result;
    }

?>