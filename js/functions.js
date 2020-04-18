// Generic function

var address = "http://localhost/ict302-webapp/"
//var address = "https://unreckoned-worry.000webhostapp.com/"

/**
 * 
 * @param {*} to        The target script (eg. server/login.php)
 * @param {*} dataIn    The data to be passed
 * @param {*} onSuccess Callback for successfull request (one argument for the response)
 * @param {*} onError Callback for successfull request (3 arguments: data, textStatus, error). "data.status" will give error code, "error" will give error description
 */
function DoGet(to, dataIn, onSuccess, onError)
{
  $.ajax({
      url: address + to,
      type: "GET",
      timeout: 5000,
      data: dataIn,
      success: function(response) { onSuccess(response) },
      error: function(data, textStatus, errorMessage) {
        onError(data, textStatus, errorMessage) 
      }
  })    
}
/**
 * 
 * @param {*} to        The target script (eg. server/login.php)
 * @param {*} dataIn    The data to be passed
 * @param {*} onSuccess Callback for successfull request (one argument for the response)
 * @param {*} onError Callback for successfull request (3 arguments: data, textStatus, error). "data.status" will give error code, "error" will give error description
 */
function DoPost(to, dataIn, onSuccess, onError)
{
  $.ajax({
      url: address + to,
      type: "POST",
      timeout: 15000,
      ContentType: 'application/json',
      data: dataIn,
      success: function(response) { onSuccess(response) },
      error: function(data, textStatus, error) {     
          onError(data, textStatus, error)
      }
  })    
}

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

function GeneratePDF(sessionID)
{
    var token = getToken()
    var mus = getMUS()

    window.open("../server/generatePDF.php?SessionID=" + sessionID + "&MUS=" + mus + "&Token=" + token);
  
}

function LogOut()
{
    var token = getToken()
    var mus = getMUS()

    var data = {
        MurdochUserNumber: mus,
        Token: token
    }

    DoPost("server/logout.php",data,(response)=>{

        window.location = "../index.php"   
        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}

