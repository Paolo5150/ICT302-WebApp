<?php
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

    function IsTokenOk()
    {
        $con = connectToDb();
        $stmt = $con->prepare("select * from user where MurdochUserNumber = ?");
        $stmt->bind_param("s", $_COOKIE['MurdochUserNumber']);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result && $result->num_rows > 0)
        {
            $data = $result->fetch_assoc(); //Get first fow
            if(isset($data['Token']) && isset($_COOKIE['Token']) && $data['Token'] == $_COOKIE['Token'])
                return true;
            else
                return false;
        }
        mysqli_close($con);
    }

    function RedirectIfTokenNotValid($redirect)
    {
        include("../server/globals.php");
        include("../server/dbConnection.php");
    
        session_start();

        if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
        {
           if(!IsTokenOk())
            header("Location: " . $redirect);
    
        }
        else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
        {
            if(!IsTokenOk())
                header("Location: " . $serverAddress . "web/loginClient.php");		
        }
        else
        {        
            header("Location: " . $serverAddress . "web/loginClient.php");
        }
    }

    function RedirectIfTokenIsValid($redirect)
    {
        include("../server/globals.php");
        include("../server/dbConnection.php");
    
        session_start();

        if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
        {
           if(IsTokenOk())
            header("Location: " . $redirect);
    
        }
        else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
        {
            if(IsTokenOk())
                header("Location: " . $serverAddress . "web/loginClient.php");		
        } 
    }


?>