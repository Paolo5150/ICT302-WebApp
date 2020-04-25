//The 'Data' from the response object is cached so it can be passed in dynamically created functions
var responseData; 
var cachedTable;

$(document).ready(function () {

    var token = getToken()
    var mus = getMUS()

    var myData = {
        Token: token,
        MurdochUserNumber: mus
    }

    DoPost("server/getStudentSessions.php",myData,(response)=>{
        console.log(response)
        if(response == "") return

         var sessionObj = JSON.parse(response)
        responseData = JSON.parse(sessionObj.Data.Content)
        var table = buildSessionTable(responseData)
        
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

    // Click account button
    $("#account-btn").click(function(e){

        $("#search-field").hide();

        var token = getToken()
        var mus = getMUS()
    
        var data = {
            MurdochUserNumber: mus,
            Token: token
        }
    
        // Account button
        DoPost("server/getUserDetails.php",data,(response)=>{
            
            var htmlContent = `<button type='button' class='btn btn-primary col-lg-1 col-md-1 col-sm-1' onClick='backToSessionTable()'>Back</button>
                                <p class='col-lg-11 col-md-11 col-sm-11 m-3 '></p>` //Create empty space for new line
            var accountTable = GenerateAccountTable()
            htmlContent += accountTable;
            $("#main-content").html(htmlContent)

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

function backToSessionTable()
{
    $("#main-content").html(cachedTable)
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
        <button type='button' class='btn btn-primary m-2' onClick="ChangeDetails()" >Save changes</button>
    </div>
    `


    return table;
}

