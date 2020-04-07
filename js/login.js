var username = document.getElementById("username"); //Username field
var password = document.getElementById("password"); //Password field
var errortext = document.getElementById("errortext"); //errortext entry text
var submit = document.getElementById("submit-btn"); //Form submit button

var scriptTarget = "server/login.php?";

//$("#errortext").hide();

$(document).ready(function () {

    $("#submit-btn").click(function(e){

        e.preventDefault();
        if(ValidateForm())
            Login();

    })
})

function ValidateForm()
{
    errortext.innerHTML = "";
    //$("#errortext").hide();

    var textDefaultColor = username.style.backgroundColor; //Default color for the text fields
    var submitDefaultColor = submit.style.backgroundColor; //Default color for the submit button

    if (ValidateUsername(username.value) & ValidatePassword(password.value)) //If the form is valid
    {
        var success = Login();
    }
    else //If the form is not valid
    {
        
        
        

        
        setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal
        {
            username.style.backgroundColor = textDefaultColor;
            password.style.backgroundColor = textDefaultColor;
            submit.style.backgroundColor = submitDefaultColor;
        }, 500);
        
        // $("#errortext").slideDown(1000);
        // setTimeout(function () //After 3 seconds, remove the fail text
        // {

        //     $("#errortext").slideUp(1000);
        // }, 4000);
    }
}

function ValidateUsername()
{
    if (username.value == "")
    {
        errortext.innerHTML += "Username must not be empty<br/>" //Add fail text
        
        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }
    else if (isNaN(username.value))
    {
        errortext.innerHTML += "Username must be a number<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }

    return true;
}

function ValidatePassword()
{
    if (password.value == "")
    {
        errortext.innerHTML += "Password must not be empty<br/>" //Add fail text

        password.style.backgroundColor = "red"; //Flash password field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }

    return true;
}

function Login()
{
    var myData = {
        MurdochUserNumber: username.value,
        Password: password.value
    }

    errortext.innerHTML = "Logging in...";

    //$("#errortext").slideDown(1000);
    
    DoPost(scriptTarget, myData, PostSuccess, PostFail);

    return true;
}

function PostSuccess(reply)
{
    console.log("Success" + reply);
    var obj = JSON.parse(reply);

    if(obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if(obj.Status == "ok")
        window.location = "test.html";
}

function PostFail(data, textStatus, errorMessage)
{
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";

    //$("#errortext").slideDown(1000);
}

function InvalidUser()
{
    invalid.innerHTML = "";
    $("#invalid").hide();

    var textDefaultColor = username.style.backgroundColor; //Default color for the text fields
    var submitDefaultColor = submit.style.backgroundColor; //Default color for the submit button

    username.select(); //Select the username again so the user can quickly change the name

    invalid.innerHTML = "Invalid username or password<br/>" //Add fail text

    username.style.backgroundColor = "red"; //Flash username field red
    password.style.backgroundColor = "red"; //Flash password field red
    submit.style.backgroundColor = "red"; //Flash submit button red

    //$("#invalid").slideDown(1000);

    setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal
    {
        username.style.backgroundColor = textDefaultColor;
        password.style.backgroundColor = textDefaultColor;
        submit.style.backgroundColor = submitDefaultColor;
    }, 500);

    // setTimeout(function () //After 3 seconds, remove the fail text
    // {
    //     $("#invalid").slideUp(1000);
    // }, 4000);

}