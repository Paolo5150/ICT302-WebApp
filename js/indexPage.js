function getToken()
{
    // Check local storage
    var token = localStorage.getItem("Token");

    // and cookie, just in case
    var cookie = document.cookie;
    var cookieValues = cookie.split(";");
    for(var i=0; i < cookieValues.length; i++)
    {
        var cookieValue = cookieValues[i]

        var index = cookieValue.indexOf("Token")
        if(index != -1)       
        {
            if(token == null || token == "")
            {
                token = cookieValue.substr(cookieValue.indexOf("=") + 1, cookieValue.length)
            }
        } 
    }

    return token;
}

function getMUS()
{
     // Check local storage
     var mus = localStorage.getItem("MurdochUserNumber");
 
     // and cookie, just in case
     var cookie = document.cookie;
     var cookieValues = cookie.split(";");
     for(var i=0; i < cookieValues.length; i++)
     {
         var cookieValue = cookieValues[i]
         var index = cookieValue.indexOf("MurdochUserNumber")
         if(index != -1)
         {
             if(mus == null || mus == "")
              mus = cookieValue.substr(cookieValue.indexOf("=") + 1, cookieValue.length)
         }
     }
     return mus;
}

$(document).ready(function () {

    var token = getToken()
    var mus = getMUS()

    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }

    

    DoPost("server/getUserInfo.php",myData,(response)=>{
            //console.log(response)
             var obj = JSON.parse(response)       
            $("#welcome-title").html("Welcome " + obj.Data.FirstName)    
            $("#main-content").html(obj.Data.TableContent)
            if(!obj.Data.SearchEnabled)
            $("#search-field").hide()
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

function backToStudentTable()
{
    window.location = "index.php";
}

function searchStudent()
{
    var token = getToken()
    var mus = getMUS()
    var search = $("#search-field").val()

    var myData = {
        Search: search,
        Token: token,
        MurdochUserNumber: mus
    }    

    DoPost("server/getUserInfo.php",myData,(response)=>{

             var obj = JSON.parse(response)       

            $("#main-content").html(obj.Data.TableContent)

        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )

}

function onSessionButtonClicked(id)
{
    var token = getToken()
    var mus = getMUS()
    $("#search-field").hide();
    var myData = {
        UserID: id,
        SessionRequest: 1,
        Token: token,
        MurdochUserNumber: mus
    }
    DoPost("server/getUserInfo.php",myData,(response)=>{
        console.log(response)
        var obj = JSON.parse(response)
        $("#main-content").html(obj.Data.TableContent);   
        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}
