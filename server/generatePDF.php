<?php

    session_start();
	include("globals.php");
    include("functions.php");    
    require('fpdf/writeHTML.php');


     if( isset($_GET["SessionID"]) && isset($_GET["MUS"]) && isset($_GET["Token"]))
     {

        $sessionID = $_GET["SessionID"];
        $id = $_GET["MUS"];
        $token = $_GET["Token"];

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
          //Check if admin
            $data = $result->fetch_assoc();
            if($data['IsAdmin'] == 1)
            {
                GenPDF($sessionID);
            }
            else
            {

            }
        }
        else
        {


        }
        
       
     }  
     

     function GenPDF($sessionID)
     {
        $con = connectToDb();
         // Get session info
        $stmt = $con->prepare("select * from session where SessionID = ?");	
		$stmt->bind_param("s", $sessionID);
        $stmt->execute();
        $result = $stmt->get_result();		

        if($result && $result->num_rows > 0)
		{
            $sessionData = $result->fetch_assoc();
            // Get user info
            $stmt = $con->prepare("select * from user where UserID = ?");	
            $stmt->bind_param("s", $sessionData['UserID']);
            $stmt->execute();
            $result = $stmt->get_result();

            $userData = $result->fetch_assoc();

            $pdf = new PDF_HTML();
            $pdf->AddPage();
            $pdf->SetFont('Arial','B',16);
            $pdf->Image("../imgs/logo.png",8,10,40,30);
            $pdf->SetY(60);
            $pdf->Cell(0,0,"Session Report (" . $sessionData['SessionID'] . ")");
            $pdf->SetY(80);
            $pdf->SetFont('Arial','B',12);
            $pdf->Write(0, "User:    " . $userData['FirstName'] . " " . $userData['LastName']);
            $pdf->SetY(90);
            $pdf->Write(0, "Murdoch ID:    " . $userData['MurdochUserNumber']);
            $pdf->SetY(110);
            $pdf->Write(0, "Date:    " . $sessionData['Date']);
            $pdf->SetY(120);
            $pdf->Write(0, "Start Time:    " . $sessionData['StartTime']);
            $pdf->SetY(130);
            $pdf->Write(0, "End Time:    " . $sessionData['EndTime']);

            $pdf->SetY(140);
            $logsObj = json_decode($sessionData['Logs']);
            $pdf->SetFont('Arial','',7);
            $line = 150;
            foreach ($logsObj as $key => $value) {
                $pdf->SetY($line);
                $pdf->WriteHTML($value);
                $line += 10;


            }



            $pdf->Output();        
		}

        
     }
    
?>