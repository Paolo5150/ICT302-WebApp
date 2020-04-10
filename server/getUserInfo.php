<?php
	session_start();
	include("globals.php");
    include("functions.php");
    
    function MakeSessionTable($userID)
    {
		$con = connectToDb();

        $tableHTML = "";
        $stmt = $con->prepare("select * from session where UserID = ?");	
		$stmt->bind_param("s", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result && $result->num_rows > 0)
		{
            $tableHTML = "
            <table class='table table-striped'>
            <thead>
            <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Retries</th>
            </tr>
            </thead>
            <tbody>";

            while($row = $result->fetch_assoc()) 
            {
                $tableHTML .="<tr>
                    <td>".$row["SessionID"]."</td>
                    <td>".$row["Date"]."</td>
                    <td>".$row["StartTime"]."</td>
                    <td>".$row["EndTime"]."</td>
                    <td>".$row["Retries"]."</td>     
                    <td><button type='button' class='btn btn-primary'>PDF</button></td>   
                </tr>";
            }
            
            $tableHTML .= "</tbody>
            </table>";     
        }
        
        return $tableHTML;
    }

    if(isset($_POST['Token']))
	{
		//Incoming variables
		$token = $_POST['Token'];

		
		$con = connectToDb();


		$stmt = $con->prepare("select * from user where Token = ?");	
		$stmt->bind_param("s", $token);
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
                $reply->Data->FirstName = $data['FirstName'];
            }

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