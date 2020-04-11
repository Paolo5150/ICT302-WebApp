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

$(document).ready(function () {

    var token = getToken()
    var mus = getMUS()

    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }    
    
    DoPost("server/getStudentSessions.php",myData,(response)=>{
        console.log(response)
        var table = buildSessionTable(response)
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