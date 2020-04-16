<?php
	session_start();
	include("globals.php");
    include("functions.php");    

     if(isset($_POST['Token']) && $_POST['Token'] != "" && isset($_POST["MurdochUserNumber"]) && isset($_POST["UserID"]))
	{
		//Incoming variables
        $token = $_POST['Token'];		
        $id = $_POST["MurdochUserNumber"];
        $userIdToRemove = $_POST["UserID"];
		$con = connectToDb();

		$stmt = $con->prepare("select * from user where Token = ? AND MurdochUserNumber = ?");	
		$stmt->bind_param("ss", $token, $id);
        $stmt->execute();
        $result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		$reply->Data = new stdClass();
		
		if($result && $result->num_rows > 0)
		{
          	//Check if admin
			$data = $result->fetch_assoc();
			
            if($data['IsAdmin'] == 1)
            {	
				$stmt = $con->prepare("delete from user where UserID = ?");	
				$stmt->bind_param("s", $userIdToRemove);
                $stmt->execute();
                $reply->Status = 'ok';                
            }
            else
            {
                $reply->Status = 'fail'; 
                $reply->Message = 'Unothorized';
            }
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "User not found";
		}
        mysqli_close($con);
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;			
    }
    

?>