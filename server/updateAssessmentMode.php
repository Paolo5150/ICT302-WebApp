
<?php
        session_start();
        include("globals.php");
        include("functions.php");
        //Prepare reply pbject
        $reply = new stdClass();
        $reply->Data = new stdClass();
        if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']))
        {
            if(!IsAccountOK($_POST['MurdochUserNumber'], $_POST['Token'])) die();

            $id = $_POST['MurdochUserNumber'];
            $checked = $_POST['Checked'];

            $con = connectToDb();

            //Prepare SQL statement. Place a '?' where you want to pass an argument
            // Below I'm passing the student ID
            $stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
                    
            // This is where I'm passing the actual argument
            $stmt->bind_param("s", $id);
                    
            // Execute the SQL statement!
            $stmt->execute();
                    
            //Check if we got something	
            $result = $stmt->get_result();					
                    
            if($result && $result->num_rows > 0)
            {			
                $data = $result->fetch_assoc(); //Get first fow
                //Ensure It's admin
                if($data['IsAdmin'] == 1)
                {
                    $stmt = $con->prepare("update Configuration set Value = ? where ConfigName = 'AssessmentMode'");
                    $stmt->bind_param("s", $checked);
                    $status = $stmt->execute();

                    $reply->Status = 'ok';
                    $reply->Message = 'Assessment Mode is ' . (($checked == 'true') ? "on" : "off");
                }
            }
        }
        else
        {
            $reply->Status= 'fail';
            $reply->Message = "Missing info";
        }

        // Send reply in JSON format
        $myJSON = json_encode($reply);			
        echo $myJSON;

?>