function buildSessionTable(response)
{
    var obj = JSON.parse(response);
    var arr = JSON.parse(obj.Data.Content)
    
    var table = `
    <table class='table table-striped'>
    <thead>
    <tr>
        <th>Session ID</th>
        <th>Date</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Errors</th>
    </tr>
    </thead>
    <tbody>
    `

    for(var i=0; i < arr.length; i++)
    {
        table += `
        <tr>
            <td onClick="Details(${i})">${arr[i][0]}</td>
            <td onClick="Details(${i})">${arr[i][3]}</td>
            <td onClick="Details(${i})">${arr[i][4]}</td>
            <td onClick="Details(${i})">${arr[i][5]}</td>
            <td onClick="Details(${i})">${arr[i][6]}</td>
            <td><button type='button' class='btn btn-primary' onClick="Details(${i})">Details</button></td>
            <td><button type='button' class='btn btn-primary' onClick="GeneratePDF(${arr[i][0]})">PDF</button></td>   
        </tr>
        <tr id="details-${i}" style="display: none">
        </tr>
        `
    }

    table += `</tbody>
    </table>`
    return table;
}

var obj;
var cachedTable;

$(document).ready(function () {

    var token = getToken()
    var mus = getMUS()

    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }

    DoPost("server/getStudentSessions.php",myData,(response)=>{
        //console.log(response)
        var table = buildSessionTable(response)
        cachedTable = table; //Save table so content can be reused in the back button
        obj = JSON.parse(response);

        $("#main-content").html(table)
        $("#welcome-title").html("Welcome " + obj.Data.UserName)

        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
})



function Details(index)
{
    var arr = JSON.parse(obj.Data.Content)
    var logsObj = JSON.parse(arr[index][7])

    var logsStrings = "";
    for(var i=0; i < arr[index][7].length; i++)
    {
        var logInd = "Log_" + i
        if(logsObj[logInd] != undefined)    
        {
            if(logsObj[logInd].indexOf("Failed") > 0)
            {
                logsStrings+= `<svg class="bi bi-x-circle-fill" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.146-3.146a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clip-rule="evenodd"/>
                </svg>`
            }
            else if(logsObj[logInd].indexOf("Correctly") > 0)
            {
                logsStrings+= `<svg class="bi bi-check-circle" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z" clip-rule="evenodd"/>
              </svg>`
            }         
            else
            {
                logsStrings+= `<svg class="bi bi-caret-right" width="2em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 12.796L11.481 8 6 3.204v9.592zm.659.753l5.48-4.796a1 1 0 000-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 001.659.753z" clip-rule="evenodd"/>
              </svg>`
            }

            logsStrings+= "<span style='font-size: 0.8em'>" + logsObj[logInd] + "</span><br/><br/>";
        }
    }

    $("#details-" + index).html(logsStrings)  
    $("#details-" + index).toggle()  

}