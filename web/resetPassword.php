<?php
    session_start();
    include("../server/globals.php");
    include("../server/functions.php");

    // Check user privileges
    if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
    {
        if(IsTokenOk($_SESSION['MurdochUserNumber'],$_SESSION['Token']))
        {
            header("Location: " . $serverAddress . "index.php");
        }            
    }
 
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset = "UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <title>Reset password</title>

        <!-- Stylesheets -->
        <link href="../css/resetstyle.css" rel="stylesheet" />
   
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        
        <!-- Load scripts -->

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

        <script src="../js/functions.js"></script>
        <script src="../js/resetPassword.js"></script>

    </head>
    <body>      
        <div id="main-container">

            <section class="inner-section" id="main-form-section">
                <div class="container-fluid">
                    <div class ="row" id="main-content">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                            <p class="display-3">Reset password</p> 
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                            <form >
                                <div class="form-group">

                                    <div class="mb-3">
                                        <label>Murdoch number</label>
                                        <input id="mus-field" type="number" class="form-control"  required/>               
                                    </div>                     

                                    <div class="mb-3">
                                        <label>Email</label>
                                        <input id="email-field" type="text" class="form-control"  required/>               
                                    </div>

                                    <div class="mb-3">
                                        <label>Old password</label>
                                        <input id="old-psw-field" type="password" class="form-control"  required/>               
                                    </div>

                                    <div class="mb-3">
                                        <label>New password (8 characters minimum, at least one number, at least one special character)</label>
                                        <input id="psw-field" type="password" class="form-control"  required/>               
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label>Confirm password</label>
                                        <input id="confirm-psw-field" type="password" class="form-control" required/>               
                                    </div>
           
                                    <button id="submit-btn" type="submit" class="btn btn-primary mb-4">Submit</button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
    </div>
    </body>
</html>