<?php
    session_start();
    include("../server/globals.php");
    include("../server/functions.php");
    $mus = "";
    $token = "" ;
    if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
    {
        $mus = $_SESSION['MurdochUserNumber'];
        $token = $_SESSION['Token']; 
    }
    else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
    {
        $mus = $_COOKIE['MurdochUserNumber'];
        $token = $_COOKIE['Token']; 
    }
    else
        header("Location: " . $serverAddress . "index.php");
    
    if(!IsAccountOK($mus, $token))
        header("Location: " . $serverAddress . "index.php");
 
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset = "UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <title>Virtual Instruments</title>
        <link rel="icon" href="../imgs/logo.png">
        <!-- Stylesheets -->
        <link href="../css/resetstyle.css" rel="stylesheet" />
        <link href="../css/toggleswitch.css" rel="stylesheet" />

   
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        
        <!-- Load scripts -->

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

        <!-- Import generic functions to do http requests -->
        <script src="../js/functions.js"></script>
        <script src="../js/admin.js"></script>

    </head>
    <body>    

    <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="mx-auto order-0">
            <div class="navbar-brand" >
                <img src="../imgs/logo.png" style="width: 50px;"/>
                <span id="welcome-title" >Welcome</span>
            </div>            
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">

                <li class="nav-item">
                    <div style="margin-right: 10px">
                    <p class="nav-link" href="#" style="display: inline-block">Assessment mode</p>
                        <div class="material-switch pull-right" style="margin: 10px" >
                            <input id="asessment-mode-btn" name="someSwitchOption001" type="checkbox" />
                            <label for="asessment-mode-btn" class="label-primary"></label>
                        </div>
                    </div> 
                </li>

                <li class="nav-item">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile">
                    <label class="custom-file-label" for="customFile">Upload student list</label>
                </div>
                </li>                
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick="GetCSV()">Get CSV</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick="CreateUserTable()">Create user</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick="GetOwnSession()">Your sessions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="account-btn">Account</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logout-btn" onClick="LogOut()">Logout</a>
                </li>
                
                
            </ul>
        </div>
    </nav>
    <div id="main-container">
   
        <section class="inner-section" id="main-form-section">
            <div class="container"> <!-- Can 'container' or 'container-fluid' -->
            <input id='search-field' class='form-control' type='text' placeholder='Search' aria-label='Search' onchange='searchStudent()'>
                <div class ="row" id="main-content"> 
                                                
                </div>  
                
                
            </div>
        </section>
    </div>
    </body>
</html>