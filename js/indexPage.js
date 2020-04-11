$(document).ready(function () {

        var token = localStorage.getItem("Token");

        var myData = {
            Token: token
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
