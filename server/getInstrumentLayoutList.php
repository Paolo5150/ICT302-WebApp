<?php
	session_start();
	include("globals.php");
	include("functions.php");

	$con = connectToDb();
	$stmt = $con->prepare("select LayoutName from layout");
	$stmt->execute();
	
	//Check if we got something	
	$result = $stmt->get_result();
	
	//Prepare reply object
	$reply = new stdClass();
	$reply->Data = new stdClass();	
	
	if($result && $result->num_rows > 0)
	{
		$data = $result->fetch_all();
		$reply->Data = json_encode($data);
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