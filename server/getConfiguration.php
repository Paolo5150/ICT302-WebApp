
<?php
        session_start();
        include("globals.php");
        include("functions.php");
        //Prepare reply pbject
        $reply = new stdClass();
        $reply->Data = new stdClass();


        $con = connectToDb();

        //Prepare SQL statement. Place a '?' where you want to pass an argument
         // Below I'm passing the student ID
        $stmt = $con->prepare("select * from configuration");
        $stmt->execute();
        $result = $stmt->get_result();					
                    
        if($result && $result->num_rows > 0)
        {			
            $data = $result->fetch_all();
            // Look for active layout
            for($i=0 ; $i < count($data) ; $i++)
            {
                if($data[$i][0] == 'ActiveLayout')
                {
                    $stmt = $con->prepare("select Value from layout where LayoutName = '{$data[$i][1]}'");
                    $stmt->execute();
                    $res = $stmt->get_result();
                    $instruments = $res->fetch_assoc();
                    $reply->Data->Layout = json_encode($instruments['Value']);
                }
                else if($data[$i][0] == 'AssessmentMode')
                {
                        $reply->Data->AssessmentMode = $data[$i][1];
                }
            }
            
        }
        // Send reply in JSON format
        $myJSON = json_encode($reply);			
        echo $myJSON;

?>