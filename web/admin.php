<?php
    session_start();
    include("../server/globals.php");
    include("../server/functions.php");

    // Check user privileges
    if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
    {
        if(IsTokenOk($_SESSION['MurdochUserNumber'],$_SESSION['Token']))
        {
            if(!IsAdmin($_SESSION['MurdochUserNumber']))
                header("Location: " . $serverAddress . "web/student.php");
        }
        else
            header("Location: " . $serverAddress . "index.php"); 
    }
 
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
                    <a class="nav-link" href="#" onClick="getOwnSession()">Your sessions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Account</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logout-btn">Logout</a>
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
    <footer class="page-footer font-small teal pt-4" style="position: fixed; bottom: 0; width: 100%; background-color: #55555555">
        <!-- Footer Text -->
        <div class="container-fluid text-center text-md-left">
        </div>
        <div class="footer-copyright text-center py-3">© 2020 Copyright Real Tech</div>
    </footer>
</html>