<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']))
	{

		$id = $_POST['MurdochUserNumber'];
		
		$con = connectToDb();

		//Prepare SQL statement. Place a '?' where you want to pass an argument
		// Below I'm passing the student ID
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
		
		// This is where I'm passing the actual argument
		$stmt->bind_param("i", $id);
		
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
            $stmt = $con->prepare("update user set Token = '', TokenExpireTime = '' WHERE  UserID = ?");
    		$stmt->bind_param("s", $data['UserID']);		
            $stmt->execute();

            $reply->Status = 'ok';
            $reply->Message = "Logout successful";

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