<?php
include("globals.php");
include("functions.php");


function ReadDatabaseTableToCSV($csvFile, $tableName)
{
  include("globals.php");
  fwrite($csvFile, "Table: " . $tableName);
  fwrite($csvFile, "\n");

  $con = connectToDb();

  $stmt = $con->prepare("SHOW COLUMNS FROM {$tableName}");
  $stmt->execute();
  
  $result = $stmt->get_result();
  $columnNames = array();
  if($result && $result->num_rows > 0)
  {			
    $data = $result->fetch_all();
    for($i=0; $i < count($data); $i++ )
    {
      array_push($columnNames,$data[$i][0]);
    }
  
  }
  
  fputcsv($csvFile, $columnNames);
  
  $stmt = $con->prepare("select * from {$tableName}");
  $stmt->execute();
  
  $result = $stmt->get_result();
  if($result && $result->num_rows > 0)
  {			
    $data = $result->fetch_all();
  
    for($row=0; $row < $result->num_rows; $row++ )
    {
      $entry = array();
  
      for($i=0; $i < count($columnNames); $i++ )
      {
        array_push($entry,$data[$row][$i]);
      }
      fputcsv($csvFile, $entry);
      
    }
  }
  fwrite($csvFile, "\n");
mysqli_close($con);
  
}

//Prepare reply pbject
$reply = new stdClass();
$reply->Data = new stdClass();

if(isset($_POST['MurdochUserNumber']) && isset($_POST['Token']))
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

      if($data['IsAdmin'] == 1)
      {
          //I'm not even sure all this is necessary...
          header("Content-type: application/force-download"); 
          header('Content-Disposition: inline; filename="data.csv" '); 
          header("Content-Transfer-Encoding: Binary"); 
         // header("Content-length: ". filesize('data.csv')); 
          header('Content-Type: application/excel'); 

          $f = fopen("data.csv", 'w');

          ReadDatabaseTableToCSV($f, 'user');
          ReadDatabaseTableToCSV($f, 'session');

          fclose($f);
          echo file_get_contents('data.csv');
      }
      else
      {
        $reply->Status = 'fail';
        $reply->Message = 'Unauthorized';
      }
  }
  else
  {
    $reply->Status = 'fail';
    $reply->Message = 'User not found';
  }

}


?>