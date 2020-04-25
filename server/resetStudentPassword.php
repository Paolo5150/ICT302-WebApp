<?php
	include("globals.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']) && isset($_POST['AccountID']))
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
            //Chck that the request came from admin
            $data = $result->fetch_assoc(); //Get first fow
           
            if($data['IsAdmin'] == 1)
            {
                $stmt = $con->prepare("update user set PasswordResetRequired = 1, Password = ? WHERE MurdochUserNumber = ?");	
                $stmt->bind_param("si", $_POST['AccountID'], $_POST['AccountID']);
                $stmt->execute();

                $reply->Status = 'ok';
                $reply->Message = "The password has been reset to " . $_POST['AccountID'] . ". A password reset will be required at the next login.";

            }
            else
            {
                $reply->Status = 'fail';
                $reply->Message = "Not authorized.";
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