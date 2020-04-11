<?php
	session_start();
	include("globals.php");
    include("functions.php");
    
    function MakeStudentsTable()
    {
		$con = connectToDb();

        $tableHTML = "";
        $stmt = $con->prepare("select * from user where IsAdmin = 0");	
        $stmt->execute();
        $result = $stmt->get_result();
        if($result && $result->num_rows > 0)
		{
            $tableHTML = "
            <table class='table table-striped'>
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>";

            while($row = $result->fetch_assoc()) 
            {
                $tableHTML .="<tr>
                    <td>".$row["MurdochUserNumber"]."</td>
                    <td>".$row["FirstName"]."</td>
                    <td>".$row["LastName"]."</td>
                    <td>".$row["Email"]."</td>   
                    <td><button type='button' class='btn btn-primary' onClick='onSessionButtonClicked(" .$row["UserID"] .")'>Sessions</button></td>   
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
        
        $table = MakeSessionTable($_POST['UserID']);
        $reply->Status = 'ok';
        $reply->Data->TableContent = $table;
        
        $myJSON = json_encode($reply);			
		echo $myJSON;
    }

?>