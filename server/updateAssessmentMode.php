
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


            $stmt = $con->prepare("select * from user where MurdochUserNumber = ?"); 
            $stmt->bind_param("s", $id);
            $stmt->execute();
                    
            //Check if we got something	
            $result = $stmt->get_result();					
                    
            if($result && $result->num_rows > 0)
            {			
                $data = $result->fetch_assoc(); //Get first fow
                //Ensure It's admin
                if($data['IsAdmin'] == 1)
                {
                    $stmt = $con->prepare("select Value from Configuration where ConfigName = 'AssessmentMode'"); 
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if($result && $result->num_rows > 0)
                    {
                        $stmt = $con->prepare("update Configuration set Value = ? where ConfigName = 'AssessmentMode'");
                        $stmt->bind_param("s", $checked);
                        $status = $stmt->execute();

                        $reply->Status = 'ok';
                        $reply->Message = 'Assessment Mode is ' . (($checked == 'true') ? "on" : "off");
                    }
                    else
                    {
                        $stmt = $con->prepare("insert into Configuration (ConfigName,Value) VALUES ('AssessmentMode',?)");
                        $stmt->bind_param("s", $checked);
                        $status = $stmt->execute();

                        $reply->Status = 'ok';
                        $reply->Message = 'Assessment Mode is ' . (($checked == 'true') ? "on" : "off");
                    }
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