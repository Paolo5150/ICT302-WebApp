<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['Value']))
	{
		//Incoming variables
		$layout = $_POST['Value'];
	
		$con = connectToDb();
		$stmt = $con->prepare("select * from configuration where ConfigName = \"ActiveLayout\"");
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();
		
		//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();	
		
		if($result)
		{
			if($result->num_rows > 0)
			{
				$data = $result->fetch_assoc(); //Get first fow
				
				$stmt = $con->prepare("update configuration set Value = ? WHERE ConfigName = 'ActiveLayout'");	
				$stmt->bind_param("s", $layout);
				$stmt->execute();
				
				$reply->Status = 'ok';
				$reply->Message = "Layout successfully set to active";
			}
			else
			{
				$stmt = $con->prepare("insert into configuration (ConfigName,Value) VALUES ('ActiveLayout',?)");
					$stmt->bind_param("s", $layout);
					$status = $stmt->execute();
				
				$reply->Status = 'ok';
				$reply->Message = "Layout successfully set to active";
			}
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "An error occurred";
		}
		
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
        echo $myJSON;
        mysqli_close($con);				
	}

?>