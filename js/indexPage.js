$(document).ready(function () {

    var token = localStorage.getItem("Token");

    var myData = {
        Token: token
    }

      $("#logout-btn").click(function(e){

        DoPost("server/logout.php",myData,(response)=>{

            window.location = "index.php"   
            },
            (data, status, error)=>
            {
                alert("An error occurred")
            } 
        )
    })
 
})
