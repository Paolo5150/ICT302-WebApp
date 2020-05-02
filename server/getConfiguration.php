
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

            $con = connectToDb();

            //Prepare SQL statement. Place a '?' where you want to pass an argument
            // Below I'm passing the student ID
            $stmt = $con->prepare("select * from Configuration");
            $stmt->execute();
            $result = $stmt->get_result();					
                    
            if($result && $result->num_rows > 0)
            {			
                $data = $result->fetch_all();
                $reply->Data = json_encode($data);              
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