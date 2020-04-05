$(document).ready(function () {

    // Hide content first
    $("#main-content").hide();

    var id = location.search.split('&')[0].substring(1,location.search.length);
    var token = location.search.split('&')[1];

    var myData = {
        MurdochUserNumber: id,
        Token: token
    }
    //Check if link is valid
    DoPost("server/checkToken.php",myData,(response)=>{
        
        console.log(response)
        // Check if link is valid
        var responseObj = JSON.parse(response);
        if(responseObj.Status == 'ok')
        {
            if(!responseObj.Data.TokenValid)
            {
                $("#main-content").html("Link has expired")
                
            }
        }
        else
        {
            //The database didn't find the user
            alert("An error occurred")
        }

        $("#main-content").show();

    })


    $("#submit-btn").click(function(e){
        e.preventDefault();

        var psw = $("#psw-field").val();
        var pswConf = $("#confirm-psw-field").val();


        if(psw === "" || pswConf === "")
        {
            // empty string not allowed
            alert("Empty password not accepted")
        }
        else
        {
            if(psw != pswConf)
            {
                // not matching
                alert("The fields are not matching")

            }
            else
            {
                // more check (password length, capital letters)

                // otherwise ok

                var data = {
                    MurdochUserNumber: id,
                    Password: psw,
                    Token: token

                }

                DoPost("server/updatePsw.php",data,onSuccess, onFail)

            }
        }


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