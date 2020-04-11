<?php
	session_start();
	include("globals.php");
    include("functions.php");
    
    // This "if" will trigger when an admin requests session info about a student
    if(isset($_POST['UserID']) && isset($_POST['SessionRequest']) && isset($_POST['Token']) && $_POST['Token'] != "" && isset($_POST["MurdochUserNumber"]))
    {

        // Ensure that this session request comes from an admin user
        $token = $_POST['Token'];		
        $id = $_POST["MurdochUserNumber"];
        $con = connectToDb();

        //Prepare reply pbject
        $reply = new stdClass();
        $reply->Data = new stdClass();


        $stmt = $con->prepare("select * from user where Token = ? AND MurdochUserNumber = ?");	
        $stmt->bind_param("ss", $token, $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result && $result->num_rows > 0)
		{
            $data = $result->fetch_assoc(); //Get first fow

            if($data['IsAdmin'] != 0)
            {
                $table = "<button type='button' class='btn btn-primary' onClick='backToStudentTable()'>Back</button><br>";
                $table .= MakeSessionTable($_POST['UserID']);
                $reply->Status = 'ok';
                $reply->Data->TableContent = $table;

            }
            else
            {
                $reply->Status = 'failed';
                $reply->Message = 'User not authrozed';
            }
		}
		else
		{
			$reply->Status = 'fail';
			$reply->Message = "User not found";
		}
        
       
        
        $myJSON = json_encode($reply);			
		echo $myJSON;
    }
    else if(isset($_POST['Token']) && $_POST['Token'] != "" && isset($_POST["MurdochUserNumber"]))
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
    

?>