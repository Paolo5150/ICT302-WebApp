<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['ConfigName']) && isset($_POST['Value']))
	{
		//Incoming variables
		$id = $_POST['ConfigName'];
		$layout = $_POST['Value'];
	
		$con = connectToDb();
		$stmt = $con->prepare("select * from layout where ConfigName = ?");
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
			
			$stmt = $con->prepare("update layout set Value = ? WHERE ConfigName = ?");	
			$stmt->bind_param("ss",  $layout, $id);
			$stmt->execute();
			
			$reply->Status = 'ok';
			$reply->Message = "Layout successfully overwritten";
        }
        else
        {
			//Add new layout here if we don't find one?
			$stmt = $con->prepare("insert into layout (ConfigName, Value) values (?, ?)");	
			$stmt->bind_param("ss",  $id, $layout);
			$stmt->execute();
            $reply->Status = 'ok';
			$reply->Message = "Layout successfully created";
		}
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
        echo $myJSON;
        mysqli_close($con);				
	}

?>