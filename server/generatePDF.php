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
                //Check that the session belongs to the user
                $stmt = $con->prepare("select * from session where SessionID = ?");	
                $stmt->bind_param("s", $sessionID);
                $stmt->execute();
                $result = $stmt->get_result();		

                if($result && $result->num_rows > 0)
                {
                    $sessionData = $result->fetch_assoc();
                    if($sessionData['UserID'] == $data['UserID'])
                        GenPDF($sessionID);
                }
            }
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

        $xCoord = 50;

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
            $pdf->SetFont('Arial','',12);

            $pdf->WriteHTML("<b>User:</b>" );
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($userData['FirstName'] . " " . $userData['LastName']);


            $pdf->SetY(90);
            $pdf->WriteHTML("<b>Murdoch ID:</b>");
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($userData['MurdochUserNumber']);

            $pdf->SetY(110);
            $pdf->WriteHTML("<b>Session type:</b>");
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($sessionData['SessionName']);

            $pdf->SetY(120);
            $pdf->WriteHTML("<b>Date:</b>" );
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($sessionData['Date']);

            $pdf->SetY(130);
            $pdf->WriteHTML("<b>Start Time:</b>");
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($sessionData['StartTime']);

            $pdf->SetY(140);
            $pdf->WriteHTML("<b>End Time:</b>");
            $pdf->SetX($xCoord);
            $pdf->WriteHTML($sessionData['EndTime']);            

            $pdf->SetY(150);
            $logsObj = json_decode($sessionData['Logs']);
            $pdf->SetFont('Arial','',7);
            $line = 160;
            $currentPage = $pdf->PageNo();
            foreach ($logsObj as $key => $value) {
                if($pdf->PageNo() > $currentPage)
                {
                    $line = 20;
                    $currentPage = $pdf->PageNo();
                }
                $pdf->SetY($line);
                if(strpos($value, 'Failed') !== false)
                    $pdf->SetTextColor(200,0,0);
                else if(strpos($value, 'Correctly') !== false)
                    $pdf->SetTextColor(0,200,0);
                else
                $pdf->SetTextColor(0,0,0);

                $pdf->WriteHTML($value);
                $line += 10;
            }

            $pdf->Output();        
		}

        
     }
    
?>