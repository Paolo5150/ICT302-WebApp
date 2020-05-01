<?php
	session_start();
	include("globals.php");
    include("functions.php");    

     if(isset($_POST['LayoutID']))
	{
		//Incoming variables
        $id = $_POST["LayoutID"];
		$con = connectToDb();

		$stmt = $con->prepare("select * from instrumentLayout where LayoutID = ?");	
		$stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		$reply->Data = new stdClass();
		
		if($result && $result->num_rows > 0)
		{
          	//Check if admin
			$data = $result->fetch_assoc();
			$stmt = $con->prepare("delete from instrumentLayout where LayoutID = ?");	
			$stmt->bind_param("s", $id);
			$stmt->execute();
			$reply->Status = 'ok';    
			$reply->Message = "Layout successfully deleted";
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "Layout not found";
		}
        mysqli_close($con);
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;			
    }
    

?>