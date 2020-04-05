<?php


	function sendEmail($to, $subject, $message)
	{
		mail($to,$subject,$message);
	}
	
	use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'D:\Composer\vendor\autoload.php';

function sendEmailLocal($to, $subject,$message)
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
		$mail->From = "	ict302it07@gmail.com";
		$mail->addAddress($to, "WHAT");
		$mail->Subject = $subject;
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