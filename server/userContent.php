<?php
	include("globals.php");
	include("dbConnection.php");
	include("email.php");
	include("functions.php");


    if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']))
	{
		//Incoming variables
		$id = $_POST['MurdochUserNumber'];
		$token = $_POST['Token'];
		
		$con = connectToDb();


		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");		
		$stmt->bind_param("s", $id);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		$reply->Data = new stdClass();

		
		if($result && $result->num_rows > 0)
		{
			$data = $result->fetch_assoc(); //Get first fow

            $tokenSaved = $data['Token'];
            if($token == $tokenSaved)
            {
      
                $reply->Status = 'ok';
            }
            else
            {
                $reply->Status = 'fail';
                $reply->Message = 'Access denied';

            }

        }
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;			
	}

?>