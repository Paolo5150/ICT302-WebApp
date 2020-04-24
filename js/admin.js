
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
            <td onClick="Details('details-${i}', sessionObj.Data, ${i})">${arr[i][0]}</td>
            <td onClick="Details('details-${i}', sessionObj.Data, ${i})">${arr[i][3]}</td>
            <td onClick="Details('details-${i}', sessionObj.Data, ${i})">${arr[i][4]}</td>
            <td onClick="Details('details-${i}', sessionObj.Data, ${i})">${arr[i][5]}</td>
            <td onClick="Details('details-${i}', sessionObj.Data, ${i})">${arr[i][6]}</td>
            <td><button type='button' class='btn btn-primary' onClick="Details('details-${i}', sessionObj.Data, ${i})">Details</button></td>
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
        <label class="col-lg-2">Admin</label>
        <div class="material-switch pull-right">
            <input id="admin-switch" name="someSwitchOption001" type="checkbox"/>
            <label for="admin-switch" class="label-primary"></label>
        </div>
    </div>    

    <div class="col-lg-12 row m-2">
        <button type='button' class='btn btn-primary m-2' onClick="CreateAccount()">Create account</button>
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

function CreateAccount()
{
    var murdochID = $("#mus-field").val()
    var fName = $("#firstname-field").val()
    var lName = $("#lastname-field").val()
    var email = $("#email-field").val()
    var isAdmin = $("#admin-switch").prop("checked")? 1 : 0;

    console.log("Is admin " + isAdmin)

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
        AdminEmail: email,
        AdminPriv: isAdmin
    }


    if (confirm("Do you want to create a new account for " + fName + " " + lName + "?")) {
        alert("Request sent.")
        DoPost("server/createUser.php",data,(response)=>{
            
            var obj = JSON.parse(response)
            if(obj.Status == 'ok')
            {
                alert(obj.Message)
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
