$(document).ready(function () {
 

    $("#submit-btn").click(function(e){
        e.preventDefault();

        var mus = $("#mus-field").val();
        var email = $("#email-field").val();
        var psw = $("#psw-field").val();
        var pswConf = $("#confirm-psw-field").val();
        var oldPsw = $("#old-psw-field").val();

        var myData = {
            MurdochUserNumber: mus,
            Email: email,
            Password: psw,
            OldPassword: oldPsw,
            Confirm: pswConf,
            }

                //Check if link is valid
            DoPost("server/checkAndUpdatePassword.php",myData,(response)=>{           
      
                var responseObj = JSON.parse(response);
                alert(responseObj.Message); 
                if(responseObj.Status == 'ok')
                {

                    setInterval(()=>{
                        window.location = "../index.php"
                    },2)
                }
            },
            
            (data, status, error)=>
            {
                //console.log(data.status + " - " + error)
                alert("An error occurred")
            }             
            )
    })
})
