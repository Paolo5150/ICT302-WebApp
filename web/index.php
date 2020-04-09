<?php
    // Summary of php below: if there's no valid login token, redirect to loginClient.php
    include("../server/globals.php");
    include("../server/functions.php");
    RedirectIfTokenNotValid($serverAddress . "web/loginClient.php")

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset = "UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <title>Title</title>

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
        <script src="../js/user.js"></script>



    </head>
    <body>      
        <div id="main-container">

            <section class="inner-section" id="main-form-section">
                <div class="container-fluid"> <!-- Can 'container' or 'container-fluid' -->
                    <div class ="row" id="main-content"> 

                            <h1>You logged in!</h1>
                        </div>
                    </div>
                </div>
            </section>
    </div>
    </body>
    <footer>

    </footer>
</html>