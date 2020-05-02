<?php
	session_start();
	include("globals.php");
    include("functions.php");    

     if(isset($_POST['LayoutName']))
	{
		//Incoming variables
        $id = $_POST["LayoutName"];
		$con = connectToDb();

		$stmt = $con->prepare("select * from layout where LayoutName = ?");	
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
			$stmt = $con->prepare("delete from layout where LayoutName = ?");	
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