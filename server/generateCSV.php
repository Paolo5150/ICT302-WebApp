<?php
include("globals.php");
include("functions.php");


function ReadDatabaseTableToCSV($csvFile, $tableName)
{
  
}

//I'm not even sure all this is necessary...
header("Content-type: application/force-download"); 
header('Content-Disposition: inline; filename="data.csv" '); 
header("Content-Transfer-Encoding: Binary"); 
header("Content-length: ". filesize('data.csv')); 
header('Content-Type: application/excel'); 

$f = fopen("data.csv", 'w');

$con = connectToDb();

$stmt = $con->prepare("SHOW COLUMNS FROM user");
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

fputcsv($f, $columnNames);

$stmt = $con->prepare("select * from user");
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
    fputcsv($f, $entry);
    
  }
}



fclose($f);
echo file_get_contents('data.csv');
mysqli_close($con);
?>