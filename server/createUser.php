<?php
	include("globals.php");
	include("functions.php");

    	//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();
    if(isset($_POST['MurdochUserNumber']) && isset($_POST["Token"]) && isset($_POST["AdminMUS"]) && isset($_POST["AdminFName"]) && isset($_POST["AdminLName"]) && isset($_POST["AdminEmail"]) && isset($_POST["AdminPriv"]))
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
            $stmt = $con->prepare("INSERT INTO user (MurdochUserNumber, FirstName, LastName, Email, Password, IsAdmin, PasswordResetRequired, AccountActive) VALUES (?, ?, ?, ?, 'admin', ?, 1, 0)");
            $stmt->bind_param("ssssi", $_POST["AdminMUS"], $_POST["AdminFName"], $_POST["AdminLName"], $_POST["AdminEmail"], $_POST["AdminPriv"]);
            $stmt->execute();            


            $reply->Status = 'ok';
            if($_POST["AdminPriv"] == 1)
                $reply->Message = 'Admin user created. Default password "admin", a password reset will be required.';
            else
                $reply->Message = 'User created. Default password "admin", a password reset will be required.';

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