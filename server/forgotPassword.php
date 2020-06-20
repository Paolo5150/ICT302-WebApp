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

            $default = "admin";
            //Save to db
            $stmt = $con->prepare("update user set Password = ?, PasswordResetRequired = 1 WHERE  MurdochUserNumber = ?");	
            $stmt->bind_param("ss", $default,$data['MurdochUserNumber']);
            $stmt->execute();

            $reply->Status = 'ok';
            $reply->Message = "Your password has been reset. Your new password is <b>". $default."</b>. You will be required to change your password at your next login. Please, use <b>".$default."</b> as your 'Old Password' in the form.";
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

    }

?>