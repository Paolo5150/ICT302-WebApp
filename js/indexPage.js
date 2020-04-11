$(document).ready(function () {

        // Check local storage
        var token = localStorage.getItem("Token");
        var mus = localStorage.getItem("MurdochUserNumber");

        // and cookie, just in case
        var cookie = document.cookie;
        var cookieValues = cookie.split(";");
        for(var i=0; i < cookieValues.length; i++)
        {
            var cookieValue = cookieValues[i]

            var index = cookieValue.indexOf("Token")
            if(index != -1)       
                token = cookieValue.substr(cookieValue.indexOf("=") + 1, cookieValue.length)
        

            index = cookieValue.indexOf("MurdochUserNumber")
            if(index != -1)
                mus = cookieValue.substr(cookieValue.indexOf("=") + 1, cookieValue.length)
        }

        var myData = {
            Token: token,
            MurdochUserNumber: mus
        }

        DoPost("server/getUserInfo.php",myData,(response)=>{
                 var obj = JSON.parse(response)       
                $("#welcome-title").html("Welcome " + obj.Data.FirstName)    
                $("#main-content").html(obj.Data.TableContent)
            },
            (data, status, error)=>
            {
                alert("An error occurred")
            } 
        )

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

function onSessionButtonClicked(id)
{
    console.log(id)   
    var myData = {
        UserID: id,
        SessionRequest: 1
    }
    DoPost("server/getUserInfo.php",myData,(response)=>{
        console.log(response)
        var obj = JSON.parse(response)
        $("#main-content").html(obj.Data.TableContent)   
        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}
