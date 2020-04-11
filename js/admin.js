
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
            <td><button type='button' class='btn btn-primary' onClick='onSessionButtonClicked(${list[i][0]})'>Session</button></td>   
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
        <th>Retries</th>
    </tr>
    </thead>
    <tbody>
    `

    for(var i=0; i < arr.length; i++)
    {
        table += `
        <tr>
            <td>${arr[i][0]}</td>
            <td>${arr[i][3]}</td>
            <td>${arr[i][4]}</td>
            <td>${arr[i][5]}</td>
            <td>${arr[i][6]}</td>
            <td><button type='button' class='btn btn-primary'>PDF</button></td>   
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

function onSessionButtonClicked(id)
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

        var obj = JSON.parse(response)
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
