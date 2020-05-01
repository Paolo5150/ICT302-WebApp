<?php
	session_start();
	include("globals.php");
	include("functions.php");

	$con = connectToDb();
	$stmt = $con->prepare("select LayoutID from instrumentLayout");
	$stmt->execute();
	
	//Check if we got something	
	$result = $stmt->get_result();
	
	//Prepare reply object
	$reply = new stdClass();
	$reply->Data = new stdClass();	
	
	if($result && $result->num_rows > 0)
	{
		while($data = $result->fetch_assoc())
		{
			$encoded = json_encode($data);
			$reply->Data += $data;
		}
	}
	else
	{
		$reply->Status = 'fail';
		$reply->Message = "No layouts found";
	}

	// Send reply in JSON format
	$myJSON = json_encode($reply);
	echo $myJSON;
	mysqli_close($con);

?>