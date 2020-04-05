// Hide content first
$("#main-content").hide();

$(document).ready(function () {



    var id = location.search.split('&')[0].substring(1,location.search.length);
    var token = location.search.split('&')[1];

    var myData = {
        MurdochUserNumber: id,
        Token: token
    }
    //Check if link is valid
    DoPost("server/checkToken.php",myData,(response)=>{
        console.log(response)
        var responseObj = JSON.parse(response);
        if(responseObj.Status == 'ok')
        {
            if(responseObj.Data.TokenValid == 0)
                $("#main-content").html(responseObj.Message);
        }
        else
        {
            alert(responseObj.Message);
        }      

    })


    $("#submit-btn").click(function(e){
        e.preventDefault();

        var psw = $("#psw-field").val();
        var pswConf = $("#confirm-psw-field").val();
        var oldPsw = $("#old-psw-field").val();


        var myData = {
            MurdochUserNumber: id,
            Password: psw,
            OldPassword: oldPsw,
            Confirm: pswConf,
            Token: token}

                //Check if link is valid
            DoPost("server/checkAndUpdatePassword.php",myData,(response)=>{           
      
                var responseObj = JSON.parse(response);
                alert(responseObj.Message); 
            })

       

    })
})
// Is the server reported no internal errors
function onSuccess(response)
{
      console.log("Server said " + response)
      // Password was changed
      if(response == 'ok')
      {
        alert("Password successfully changed")
        
      }
      else
      {
        alert("An error occurred")
      }
      $("#submit-btn").hide();

}

// If post request doesn't go through
function onFail(response)
{
    
}