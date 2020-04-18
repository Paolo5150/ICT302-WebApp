<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']) && isset($_POST['FirstName']) && isset($_POST['LastName']) && isset($_POST['Email']) )
	{
		 //Incoming variables
         $id = $_POST['MurdochUserNumber'];
		 $token = $_POST['Token'];
		 $fName = $_POST['FirstName'];
		 $lName = $_POST['LastName'];
		 $email = $_POST['Email'];
		
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

			$stmt = $con->prepare("update user set FirstName = ?, LastName = ?, Email = ? WHERE  MurdochUserNumber = ?");	
            $stmt->bind_param("ssss",  $fName, $lName, $email, $id);
            $stmt->execute();
			$reply->Status = 'ok';
			$reply->Message = "Details successfully changed";
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