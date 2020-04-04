
$(document).ready(function () {


    $("#submit-btn").click(function(e){
        e.preventDefault();

        var psw = $("#psw-field").val();
        var pswConf = $("#confirm-psw-field").val();
        var id = location.search.substring(1,location.search.length);

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

                }

                DoPost("server/updatePsw.php",data,onSuccess, onFail)

            }
        }


    })
})

function onSuccess(response)
{
      //console.log("Server said " + response)
      alert("Password successfully changed")
      $("#submit-btn").hide();

}

// If post request doesn't go through
function onFail(response)
{
    
}