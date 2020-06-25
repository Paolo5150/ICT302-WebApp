<?php
include("globals.php");
include("functions.php");


//Prepare reply pbject
$reply = new stdClass();
$reply->Data = new stdClass();

if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']) && isset($_POST['Platform']))
{
  $id = $_POST['MurdochUserNumber'];

  $con = connectToDb();
  $stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
  $stmt->bind_param("s", $id);
  $stmt->execute();          
  $result = $stmt->get_result();					
          
  if($result && $result->num_rows > 0)
  {			
      $data = $result->fetch_assoc(); //Get first fow
      
    
      if($_POST['Platform'] == 'Win')
        $reply->Data = $serverAddress . "/server/Build/Win_App.zip";
      else
        $reply->Data = $serverAddress . "/server/Build/Mac_App.zip";
   
  }
  else
  {
    $reply->Status = 'fail';
    $reply->Message = 'User not found';
  }

}

$myJSON = json_encode($reply);			
echo $myJSON;


?>