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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Virtual Instruments</title>
    <link rel="icon" href="../imgs/logo.png">
    <!-- Stylesheets -->
    <link href="../css/resetstyle.css" rel="stylesheet" />
    <link href="../css/toggleswitch.css" rel="stylesheet" />
    <link href="../css/instrumentLayout.css" rel="stylesheet" />


    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Load scripts -->

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"></script>

    <!-- Import generic functions to do http requests -->
    <script src="../js/functions.js"></script>
    <script src="../js/instrumentLayout.js"></script>

</head>

<body>

    <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="mx-auto order-0">
            <div class="navbar-brand">
                <img src="../imgs/logo.png" style="width: 50px;" />
                <span id="welcome-title">Welcome</span>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
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
            <div class="container">
                <!-- Can be 'container' or 'container-fluid' -->
                <form style="text-align: center;">
                    <div id="layout-settings" style="margin: 5px 0px 20px 0px">
                        <!--Dropdown for selecting a saved layout-->
                        Select a layout slot:
                        <select id="select-layout-dropdown" style="margin-bottom: 5px;">
                            <option value="Layout1">Layout 1</option>
                            <option value="Layout2">Layout 2</option>
                            <option value="Layout3">Layout 3</option>
                            <option value="NewLayout">Save as new layout...</option>
                        </select> <br>
                        <input type="button" id="load-layout-btn" class="btn btn-primary" value="Load Layout" style="background-color: green; border-color: green">
                        <input type="button" id="delete-layout-btn" class="btn btn-primary" value="Delete Layout" style="background-color: red; border-color: red">
                        <br>
                        <!--Dropdown for how many slots to fill-->
                        Max Instruments:
                        <select id="select-size-dropdown" style="margin-top: 10px;">
                            <option value="0">0</option>
                        </select>
                    </div>
                    <ul id="slot-dropdown-container">
                    </ul>
                    <p id="error-text"></p>
                    <input type="button" id="reset-btn" class="btn btn-primary" value="Reset">
                    <input type="submit" id="save-btn" class="btn btn-primary" value="Submit">
                </form>
                <img id="refimage" src="../imgs/TableReference.png">
            </div>
        </section>
    </div>
</body>

</html>