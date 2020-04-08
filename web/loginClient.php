<?php

    // Summary of php below: if there's a valid login token, redirect to index.php
    include("../server/globals.php");
    include("../server/dbConnection.php");

    session_start();
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
              if($data['Token'] == $_COOKIE['Token'])
                  return true;
              else
                  return false;
          }
          mysqli_close($con);
      }   
    if(isset($_SESSION['MurdochUserNumber']) && isset($_SESSION['Token']))
    {
       if(IsTokenOk())
        header("Location: " . $serverAddress . "web/index.php");

    }
    else if(isset($_COOKIE['MurdochUserNumber']) && isset($_COOKIE['Token']))
    {
        if(IsTokenOk())
            header("Location: " . $serverAddress . "web/index.php");		
    }

?>

<!DOCTYPE html>

<html lang="en-AU" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <title>Title</title>

  <!-- Stylesheets -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="../css/login.css" rel="stylesheet" type="text/css" />

  <!-- Load scripts -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

  <!-- Import generic functions to do http requests -->
  <script src="../js/functions.js"></script>
</head>

<body>
  <div id="main-container">
    <section class="inner-section" id="main-form-section">
      <div class="container-fluid">
        <div class="row" id="main-content">
          <div class="col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="center">
              <div class="title">
                <p style="text-align: center; margin: 5px;"><b><u>Virtual Instruments</u></b></p>
              </div>
              <div class="loginarea">
                <p style="text-align: center; margin-bottom: 50px;">Log In</p>
                <form class="loginform" method="post">
                  <input type="text" id="username" class="textfield" style="margin-bottom: 5px;" placeholder="Username"><br>
                  <input type="password" id="password" class="textfield" placeholder="Password" style="margin-bottom: 20px;"><br>
                  <p id="errortext"></p>
                  <input type="button" class="btn btn-primary" value="Back">
                  <input type="submit" id="submit-btn" class="btn btn-primary" value="Submit">
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <script src="../js/login.js"></script>
</body>

</html>