<?php
	include_once("globals.php");
	include("dbConnection.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
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
			$reply->Status = 'ok';
			$reply->Data = new stdClass();

			// Add additional info about the status of the token
			$tokenExpiration = strtotime($data['TokenExpireTime']);
			$tokenSaved = $data['Token'];

			$now = strtotime(date('G:i:s'));
			if($token == $tokenSaved && $now < $tokenExpiration)
				$reply->Data->TokenValid = 1;
			else
			{
			    $reply->Data->TokenValid = 0;
				$reply->Message = 'Link expired';

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

?>