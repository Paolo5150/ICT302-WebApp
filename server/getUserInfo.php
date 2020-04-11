<?php
	session_start();
	include("globals.php");
    include("functions.php");    

    if(isset($_POST['Token']) && $_POST['Token'] != "" && $_POST["MurdochUserNumber"])
	{
		//Incoming variables
        $token = $_POST['Token'];		
        $id = $_POST["MurdochUserNumber"];
		$con = connectToDb();


		$stmt = $con->prepare("select * from user where Token = ? AND MurdochUserNumber = ?");	
		$stmt->bind_param("ss", $token, $id);
        $stmt->execute();
        $result = $stmt->get_result();
		
		//Prepare reply pbject
		$reply = new stdClass();
		$reply->Data = new stdClass();
		
		if($result && $result->num_rows > 0)
		{
            $data = $result->fetch_assoc(); //Get first fow

            if($data['IsAdmin'] == 0)
            {
                $table = MakeSessionTable($data['UserID']);
                $reply->Status = 'ok';
                $reply->Data->TableContent = $table;
            }
            else
            {
                $table = MakeStudentsTable();
                $reply->Status = 'ok';
                $reply->Data->TableContent = $table;
                
            }
            $reply->Data->FirstName = $data['FirstName'];

		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "User not found";
		}
        mysqli_close($con);
		
		// Send reply in JSON format
		$myJSON = json_encode($reply);			
		echo $myJSON;			
    }
    else if(isset($_POST['UserID']) && isset($_POST['SessionRequest']))
    {
        //Prepare reply pbject
		$reply = new stdClass();
        $reply->Data = new stdClass();
        
        $table = "<button type='button' class='btn btn-primary' onClick='backToStudentTable()'>Back</button><br>";
        $table .= MakeSessionTable($_POST['UserID']);
        $reply->Status = 'ok';
        $reply->Data->TableContent = $table;
        
        $myJSON = json_encode($reply);			
		echo $myJSON;
    }

?>