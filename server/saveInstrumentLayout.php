<?php
	session_start();
	include("globals.php");
	include("functions.php");

    if(isset($_POST['LayoutID']) && isset($_POST['Layout']))
	{
		//Incoming variables
		$id = $_POST['LayoutID'];
		$layout = $_POST['Layout'];
	
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
			
			//Ensure it's an admin
			//if($data['IsAdmin'] == 1)
			//{
				$stmt = $con->prepare("update instrumentLayout set Layout = ? WHERE LayoutID = ?");	
				$stmt->bind_param("ss",  $layout, $id);
				$stmt->execute();
			//}
			//else
			//{
				//$reply->Status = 'fail';
				//$reply->Message = "Not authorized";
			//}
			
			$reply->Status = 'ok';
			$reply->Message = "Layout successfully saved";
        }
        else
        {
			//Add new layout here if we don't find one?
			$stmt = $con->prepare("insert into instrumentLayout (LayoutID, Layout) values (?, ?)");	
			$stmt->bind_param("ss",  $id, $layout);
			$stmt->execute();
            $reply->Status = 'ok';
			//$reply->Message = "Layout not found";
		}
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
        echo $myJSON;
        mysqli_close($con);				
	}

?>