<?php
	include("globals.php");
	include("functions.php");

    	//Prepare reply object
		$reply = new stdClass();
		$reply->Data = new stdClass();
    if(isset($_POST['MurdochUserNumber']) && isset($_POST["SessionString"]))
	{
        $id = $_POST['MurdochUserNumber'];
        $sessionJSON = $_POST['SessionString'];

		$con = connectToDb();
		$stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
		$stmt->bind_param("s", $id);
		$stmt->execute();
		
		//Check if we got something	
		$result = $stmt->get_result();

		
		if($result && $result->num_rows > 0)
		{
            $data = $result->fetch_assoc(); //Get first fow
            $userID = $data['UserID']; //FK to update session table

            //Decode json
            $sessionResults = json_decode($sessionJSON);
            $unityID = $sessionResults->UnityID;
            $date = $sessionResults->Date;
            $startTime = $sessionResults->StartTime;
            $endTime = $sessionResults->EndTime;
            $retries = $sessionResults->Retries;

            $logsDecoded = json_encode($sessionResults->Logs);
            $logs = $logsDecoded;
            echo $logs;
            //Check that the session wasn't saved
            $stmt = $con->prepare("select * from session where UnityID = ?");
            $stmt->bind_param("i", $unityID);
            $stmt->execute();

            $result = $stmt->get_result();
            if($result && $result->num_rows == 0)
            {
                $stmt = $con->prepare("INSERT INTO session (UserID, UnityID, Date, StartTime, EndTime, Retries, Logs) VALUES (?,?,?,?,?,?,?)");
                $stmt->bind_param("iisssis", $userID, $unityID, $date, $startTime, $endTime, $retries, $logs);
                $stmt->execute();
            }  
            
            $reply->Status = 'ok';
        }
        else
        {
            $reply->Status = 'fail';
            $reply->Message = 'User not found';
        }       
        
    }
    else
    {
        $reply->Status = 'fail';
        $reply->Message = 'Values not set';
    }

    $myJSON = json_encode($reply);			
	echo $myJSON;

?>