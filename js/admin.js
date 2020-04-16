
function buildStudentTable(list)
{
    
    var table = `
    <table class='table table-striped'>
    <thead>
    <tr>
        <th>Student ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
    </tr>
    </thead>
    <tbody>
    `

    for(var i=0; i < list.length; i++)
    {
        
        table += `
        <tr>
            <td>${list[i][1]}</td>
            <td>${list[i][2]}</td>
            <td>${list[i][3]}</td>
            <td>${list[i][4]}</td>
            <td><button type='button' class='btn btn-primary' onClick='onSessionButtonClicked(${list[i][0]},"${list[i][2]}","${list[i][3]}" )'>Session</button></td>   
        </tr>
        `
    }

    table += `</tbody>
    </table>`

    return table;
}

function buildSessionTable(response)
{
    var obj = JSON.parse(response);
    var arr = JSON.parse(obj.Data)
    
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
            <td><button type='button' class='btn btn-primary'>PDF</button></td>   
        </tr>
        <tr id="details-${i}" style="display: none">
        </tr>
        `
    }

    table += `</tbody>
    </table>`
    return table;
}

var cachedStudentTable;
var cachedStudentList;

$(document).ready(function () {

    var token = getToken()
    var mus = getMUS()

    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }    
    
    DoPost("server/getStudentList.php",myData,(response)=>{

        var obj = JSON.parse(response);
        var list = JSON.parse(obj.Data.Content)

        cachedStudentList = list;
        var table = buildStudentTable(list)
        cachedStudentTable = table;
        $("#welcome-title").html("Welcome " + obj.Data.UserName)
        $("#main-content").html(table)

        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )

  $("#logout-btn").click(function(e){

    DoPost("server/logout.php",myData,(response)=>{

        window.location = "../index.php"   
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
    $("#main-content").html(cachedStudentTable);
    $("#search-field").show();
}

function searchStudent()
{

    var search = $("#search-field").val()
    var list = []
    for(var i=0; i< cachedStudentList.length; i++)
    {
        console.log(cachedStudentList[i][1])
        // If student no, name or email mcontain the search bar value
        if(String(cachedStudentList[i][1]).indexOf(search) != -1 || String(cachedStudentList[i][2]).toLowerCase().indexOf(search.toLowerCase()) != -1 
            || String(cachedStudentList[i][3]).toLowerCase().indexOf(search.toLowerCase()) != -1 || String(cachedStudentList[i][4]).toLowerCase().indexOf(search.toLowerCase()) != -1)
            list.push(cachedStudentList[i])
    }
    
    var table = buildStudentTable(list)
    cachedStudentTable = table;
    $("#main-content").html(table);

}

var sessionObj;
function onSessionButtonClicked(id,firstname,lastname)
{
    var token = getToken()
    var mus = getMUS()
    $("#search-field").hide();
    var myData = {
        UserID: id,
        Token: token,
        MurdochUserNumber: mus
    }
    DoPost("server/getStudentSessions.php",myData,(response)=>{

        //console.log(response)
        sessionObj = JSON.parse(response)
        var table = buildSessionTable(response)

        var html = `<button type='button' class='btn btn-primary' onClick='backToStudentTable()'>Back</button>`
        html += '<h3 style="margin: auto">' + firstname + ' ' +  lastname + '</h3>'
        html += table;
        $("#main-content").html(html);   

        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}

function getOwnSession()
{
    var token = getToken()
    var mus = getMUS()
    $("#search-field").hide();
    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }
    DoPost("server/getStudentSessions.php",myData,(response)=>{

        //console.log(response)
        sessionObj = JSON.parse(response)
        var table = buildSessionTable(response)

        var html = `<button type='button' class='btn btn-primary' onClick='backToStudentTable()'>Back</button>`
        html += table;
        $("#main-content").html(html);   
   

        },
        (data, status, error)=>
        {
            alert("An error occurred")
        } 
    )
}

function Details(index)
{
    var arr = JSON.parse(sessionObj.Data)
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
                logsStrings+= `<svg class="bi bi-caret-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 12.796L11.481 8 6 3.204v9.592zm.659.753l5.48-4.796a1 1 0 000-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 001.659.753z" clip-rule="evenodd"/>
              </svg>`
            }

            logsStrings+= "<span>" + logsObj[logInd] + "</span><br/><br/>";
        }    
    }

    $("#details-" + index).html(logsStrings)  
    $("#details-" + index).toggle()  

}
