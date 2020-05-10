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

    var mus = getMUS()

    var data = {
        MurdochUserNumber: mus,
    }
      

    DoPost("server/logout.php",data,(response)=>{
        console.log(response)
        window.location = "../index.php"   
        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}

const SESSION_COLUMN = {
    SessionID: 0,
    SessionName: 1,
    UserID: 2,
    UnityID: 3,
    Date: 4,
    StartTime: 5,
    EndTime: 6,
    Errors: 7,
    IsAssessed: 8,
    Logs: 9
}

function buildSessionTable(responseData)
{


    var arr = responseData
    
    var table = `
    <table class='table table-striped'>
    <thead>
    <tr>
        <th>Session Name</th>
        <th>Date</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Errors</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    `

    for(var i=0; i < arr.length; i++)
    {
        var errorsButton = ""

        if(arr[i][SESSION_COLUMN.Errors] > 0)
            errorsButton = `<button type='button' class='btn btn-danger' onClick="Details('#details-${i}', responseData[${i}], true)">${arr[i][SESSION_COLUMN.Errors]}</button>`
        else
            errorsButton = `${arr[i][SESSION_COLUMN.Errors]}`

        table += `
        <tr>
            `
            if(arr[i][SESSION_COLUMN.IsAssessed] != 0)
            {
                table += `<td style="text-align:center; position: relative" ><svg style="position: absolute; left: 10" class="bi bi-award-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0l1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                </svg>${arr[i][SESSION_COLUMN.SessionName]}</td>`

            }
            else
            {
                table += `<td style="text-align:center">${arr[i][SESSION_COLUMN.SessionName]}</td>`
            }
            
        table +=`
        
            <td>${arr[i][SESSION_COLUMN.Date]}</td>
            <td>${arr[i][SESSION_COLUMN.StartTime]}</td>
            <td>${arr[i][SESSION_COLUMN.EndTime]}</td>
            <td>${errorsButton}</td>
            <td><button type='button' class='btn btn-primary' onClick="Details('#details-${i}', responseData[${i}])">Details</button></td>
            <td><button type='button' class='btn btn-primary' onClick="GeneratePDF(${arr[i][SESSION_COLUMN.SessionID]})">PDF</button></td> 
        </tr>
        <tr >
        <td colspan="7" id="details-${i}" style="display: none; background-color: #88888822"></td>
        </tr>
        `
    }

    table += `</tbody>
    </table>`
    return table;
}

function Details(divId, dataContent, errorsOnly = false)
{
    var logsObj = JSON.parse(dataContent[SESSION_COLUMN.Logs])

    var logsStrings = "";
    for(var i=0; i < dataContent[SESSION_COLUMN.Logs].length; i++)
    {
        var logInd = "Log_" + i
        if(logsObj[logInd] != undefined)    
        {
            if(logsObj[logInd].indexOf("Failed") > 0)
            {
                logsStrings+= `<svg class="bi bi-x-circle-fill" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.146-3.146a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clip-rule="evenodd"/>
                </svg>`
            logsStrings+= "<span style='font-size: 0.8em;color: red'>" + logsObj[logInd] + "</span><br/><br/>";

            }
            else if(logsObj[logInd].indexOf("Correctly") > 0  && !errorsOnly)
            {
                logsStrings+= `<svg class="bi bi-check-circle" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z" clip-rule="evenodd"/>
              </svg>`
                logsStrings+= "<span style='font-size: 0.8em;color: green'>" + logsObj[logInd] + "</span><br/><br/>";

            }         
            else if(!errorsOnly)
            {
                logsStrings+= `<svg class="bi bi-caret-right" width="2em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 12.796L11.481 8 6 3.204v9.592zm.659.753l5.48-4.796a1 1 0 000-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 001.659.753z" clip-rule="evenodd"/>
              </svg>`
                logsStrings+= "<span style='font-size: 0.8em'>" + logsObj[logInd] + "</span><br/><br/>";

            }

        }
    }

    $(divId).html(logsStrings)  
    $(divId).toggle()  

}

function RefreshPage()
{
    window.location = window.location;
}

