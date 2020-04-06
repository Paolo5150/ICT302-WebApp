<?php

	include("phpmailer/PHPMailer.php");
	include("phpmailer/SMTP.php");
	include("phpmailer/Exception.php");
	include("globals.php");


	function sendEmail($to, $subject, $message)
	{
		include("globals.php");
		if($serverAddress == 'http://localhost/ict302-webapp/')
			sendLocal($to, $subject,$message);
		else
			sendRemote($to, $subject, $message);
	}

	function sendRemote($to, $subject, $message)
	{
		mail($to,$subject,$message);

	}




	/* Uncomment this and comment the function above if needed to send email from local server*/

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;


	//require 'D:\composer\vendor\autoload.php';

	function sendLocal($to, $subject,$message)
	{
		$mail = new PHPMailer(TRUE);
		try {

		$mail->IsSMTP();                           // telling the class to use SMTP
		$mail->SMTPAuth   = true;                  // enable SMTP authentication
		$mail->Host       = "smtp.gmail.com"; // set the SMTP server
		$mail->Port       = 587;                    // set the SMTP port
		$mail->Username   = "ict302it07@gmail.com"; // SMTP account username
		$mail->SMTPSecure = 'tsl';
		$mail->Password   = "realtech_ict302";        // SMTP account password
		$mail->From = "ict302it07@gmail.com";
		$mail->addAddress($to, "WTF");
		$mail->Subject = $subject;
		$mail->Body = '<div></div><div>'.$message.'</div>';
		$mail-> IsHTML(true);

		$mail->send();
		return true;


		}
		catch (Exception $e)
		{
		return false;
		}
	}
?>