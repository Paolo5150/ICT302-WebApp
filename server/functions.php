<?php
    function connectToDb()
    {
        include("globals.php");
        $con = mysqli_connect($databaseAddress,$databaseUsername,$databasePassword,$databaseName);
        return $con;
    }

    function encrypt_decrypt($action, $string) {
        $output = false;

        $encrypt_method = "AES-256-CBC";
        $secret_key = '6818f23eef19d38dad1d2729991f6368';
        $secret_iv = '0ac35e3823616c810f86e526d1ed59e7';

        // hash
        $key = hash('sha256', $secret_key);
        
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);

        if ( $action == 'e' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if( $action == 'd' ) {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }

    function IsTokenOk($id, $token)
    {
        $con = connectToDb();
        $stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result && $result->num_rows > 0)
        {
            $data = $result->fetch_assoc(); //Get first fow
            if(isset($data['Token']) && $data['Token'] == $token && $data['PasswordResetRequired'] == 0)
                return true;
            else
                return false;
        }
        mysqli_close($con);
    }



    function RedirectIfTokenNotValid($redirect)
    {
    
        if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
        {
           if(!IsTokenOk($_SESSION['MurdochUserNumber'],$_SESSION['Token']))
            header("Location: " . $redirect);
    
        }
        else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
        {
            if(!IsTokenOk($_COOKIE['MurdochUserNumber'], $_COOKIE['Token']))
                header("Location: " . $redirect);		
        }
        else
        {        
            header("Location: " . $redirect);
        }
    }

    function RedirectIfTokenIsValid($redirect)
    {
        if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
        {
           if(IsTokenOk($_SESSION['MurdochUserNumber'],$_SESSION['Token']))
            header("Location: " . $redirect);
    
        }
        else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
        {
            if(IsTokenOk($_COOKIE['MurdochUserNumber'],$_COOKIE['Token']))
                header("Location: " . $redirect);		
        } 
    }

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

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	function sendLocal($to, $subject,$message)
	{
        include("phpmailer/PHPMailer.php");
        include("phpmailer/SMTP.php");
        include("phpmailer/Exception.php");

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