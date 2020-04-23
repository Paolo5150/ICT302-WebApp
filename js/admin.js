
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
            <td><button type='button' class='btn btn-danger' onClick="DeleteStudent(${list[i][0]})">Delete</button></td>    
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

    // Click account button
    $("#account-btn").click(function(e){

        $("#search-field").hide();

        var token = getToken()
        var mus = getMUS()
    
        var data = {
            MurdochUserNumber: mus,
            Token: token
        }
    
        DoPost("server/getUserDetails.php",data,(response)=>{
            

            var accountTable = GenerateAccountTable()

            $("#main-content").html(accountTable)

            var responseObj = JSON.parse(response)
            var data = JSON.parse(responseObj.Data)

            $("#mus-field").val(data.MurdochUserNumber)
            $("#firstname-field").val(data.FirstName)
            $("#lastname-field").val(data.LastName)
            $("#email-field").val(data.Email)

    
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

function ChangeDetails()
{
    if(confirm("You want to save the changes made?"))
    {
        var fName = $("#firstname-field").val();
        var lName = $("#lastname-field").val();
        var email = $("#email-field").val();
        var token = getToken()
        var mus = getMUS()

        var data = {
            FirstName: fName,
            LastName: lName,
            Email: email,
            MurdochUserNumber: mus,
            Token: token
        }

        DoPost("server/updateAccountDetails.php",data,(response)=>{

            console.log(response)
            var rObj = JSON.parse(response)
            alert(rObj.Message)       
    
            },
            (data, status, error)=>
            {
                alert("An error occurred")
            } 
        )

    }
}


function GenerateAccountTable()
{

    var table = `
    <button type='button' class='btn btn-primary col-lg-1 col-md-1 col-sm-1' onClick='backToStudentTable()'>Back</button>
                                <p class='col-lg-11 col-md-11 col-sm-11 m-3 '></p>
    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Murdoch ID</label>
        <input id="mus-field" type="text" class="form-control col-lg-10" readonly/>
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">First Name</label>
        <input id="firstname-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Last Name</label>
        <input id="lastname-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Email</label>
        <input id="email-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <button type='button' class='btn btn-primary m-2' onClick="ChangeDetails()">Save changes</button>
        <button type='button' class='btn btn-primary m-2' id="change-psw-btn" onClick="ChangePassword()">Change password</button>
    </div>
    `


    return table;
}



function GetOwnSession()
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
                logsStrings+= `<svg class="bi bi-x-circle-fill" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="font-color: red">
                <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.146-3.146a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clip-rule="evenodd"/>
                </svg>`
                logsStrings+= "<span style='font-size: 0.8em;color: red'>" + logsObj[logInd] + "</span><br/><br/>";

            }
            else if(logsObj[logInd].indexOf("Correctly") > 0)
            {
                logsStrings+= `<svg class="bi bi-check-circle" width="3em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z" clip-rule="evenodd"/>
              </svg>`
                logsStrings+= "<span style='font-size: 0.8em;color: green'>" + logsObj[logInd] + "</span><br/><br/>";

            }         
            else
            {
                logsStrings+= `<svg class="bi bi-caret-right" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M6 12.796L11.481 8 6 3.204v9.592zm.659.753l5.48-4.796a1 1 0 000-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 001.659.753z" clip-rule="evenodd"/>
              </svg>`
                logsStrings+= "<span style='font-size: 0.8em'>" + logsObj[logInd] + "</span><br/><br/>";

            }

        }    
    }

    $("#details-" + index).html(logsStrings)  
    $("#details-" + index).toggle()  

}


function CreateAdminTable()
{
    var table = `
    <button type='button' class='btn btn-primary col-lg-1 col-md-1 col-sm-1' onClick='backToStudentTable()'>Back</button>
                                <p class='col-lg-11 col-md-11 col-sm-11 m-3 '></p>
    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Murdoch ID</label>
        <input id="mus-field" type="text" class="form-control col-lg-10" />
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">First Name</label>
        <input id="firstname-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Last Name</label>
        <input id="lastname-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <label class="col-lg-2">Email</label>
        <input id="email-field" type="text" class="form-control col-lg-10"/>
    </div>

    <div class="col-lg-12 row m-2">
        <button type='button' class='btn btn-primary m-2' onClick="CreateAdminAccount()">Create account</button>
    </div>
    `

    $("#search-field").hide();
    $("#main-content").html(table);

    // Eliminate non numbers characters
    $("#mus-field").change(function() {
        
        var newValue = "";
        for(var i=0; i< $("#mus-field").val().length; i++)
        {
            if(IsNumber($("#mus-field").val()[i]))
            {  
                newValue += $("#mus-field").val()[i];
            }
        }
       
        $("#mus-field").val(newValue)
        
      });
}

function IsNumber(c){
    return (c >= "0" && c <= "9");
}

function removeAllNonNumbers(value)
{
    var newValue = "";
    for(var i=0; i< value.length; i++)
    {
        if(isNumber(value[i]))
        {  
            newValue += value[i];
        }
    }
    return newValue;
}

function CreateAdminAccount()
{
    var murdochID = $("#mus-field").val()
    var fName = $("#firstname-field").val()
    var lName = $("#lastname-field").val()
    var email = $("#email-field").val()

    if(murdochID == '' || fName == '' || lName == '' || email == '')
    {
        alert("Empty fields not allowed")
        return
    }
    
  
    var mus = getMUS()
    var token = getToken()

    var data = {
        MurdochUserNumber: mus,
        Token: token,
        AdminMUS: murdochID,
        AdminFName: fName,
        AdminLName: lName,
        AdminEmail: email
    }


    if (confirm("Do you want to create a new account for " + fName + " " + lName + "?")) {
        alert("An email will be sent to the specified address")
        DoPost("server/createAdmin.php",data,(response)=>{

            var obj = JSON.parse(response)
            if(obj.Status == 'ok')
            {
               // alert(obj.Message)
            }
    
            },
            (data, status, error)=>
            {
               // alert("An error occurred")
            } 
        )
      }
}


function DeleteStudent(userID)
{
    var token = getToken()
    var mus = getMUS()

    var myData = {
        UserID: userID,
        Token: token,
        MurdochUserNumber: mus
    }

    if (confirm("Are you sure you want to delete this account?")) {
        DoPost("server/deleteAccount.php",myData,(response)=>{

            var obj = JSON.parse(response)
            if(obj.Status == 'ok')
            {
                window.location = "admin.php" //Refresh
            }
    
            },
            (data, status, error)=>
            {
                alert("An error occurred")
            } 
        )
      }
    
}
