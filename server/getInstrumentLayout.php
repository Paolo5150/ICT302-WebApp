<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['LayoutID']))
	{
		//Incoming variables
		$id = $_POST['LayoutID'];
		
		$con = connectToDb();
		$stmt = $con->prepare("select * from instrumentLayout where LayoutID = ?");
		$stmt->bind_param("s", $id);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();	
		
		if($result && $result->num_rows > 0)
		{
			$data = $result->fetch_assoc(); //Get first fow
			$encoded = json_encode($data);
			$reply->Data = $data;
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "Layout not found";
		}

		// Send reply in JSON format
		$myJSON = json_encode($reply);			
        echo $myJSON;
        mysqli_close($con);				
	}

?>