<?php

	include("dbConnection.php");

    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Password']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
		$psw = $_POST['Password'];
		$token = $_POST['Token'];

		$con = connectToDb();

		// Check token

		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
		$stmt->bind_param("s", $id);
		$stmt->execute();
		$result = $stmt->get_result();
		if($result && $result->num_rows > 0)
		{
			$data = $result->fetch_assoc(); //Get first fow
			$tokenExpiration = strtotime($data['TokenExpireTime']);
			$tokenSaved = $data['Token'];
			$now = strtotime(date('G:i:s'));
		
			if($now < $tokenExpiration && $token == $tokenSaved)
			{
				//Update password, reset token (IMPORTANT)
				$stmt = $con->prepare("update user set Password = ?, Token = '', TokenExpireTime = '' WHERE  MurdochUserNumber = ?");
				$stmt->bind_param("si", $psw, $id );
				$status = $stmt->execute();
				$stmt->get_result();	
				
				if($status)
				{
					// If ok, activate account
					$stmt = $con->prepare("update user set AccountActive = 1 WHERE  MurdochUserNumber = ?");
					$stmt->bind_param("i", $id );
					$stmt->execute();
					echo 'ok';
				}
				else
				{
					echo 'fail';
				}
			}
			else
			{
				echo 'fail: link expired';
			}
		}
	}

?>