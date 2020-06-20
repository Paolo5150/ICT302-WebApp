var username = document.getElementById("username"); //Username field
var email = document.getElementById("email"); //Email field
var errortext = document.getElementById("errortext"); //errortext entry text
var submit = document.getElementById("submit-btn"); //Form submit button

var scriptTarget = "server/forgotPassword.php?"; //The forgot password script location

$(document).ready(function () {

    $("#back-btn").click(function(e){

        e.preventDefault();
        if(ValidateForm())
            ForgotPassword();
    })

    $("#submit-btn").click(function(e){

        e.preventDefault();
        if(ValidateForm())
            ForgotPassword();
    })
})

function ValidateForm()
{
    var textDefaultColor = username.style.backgroundColor; //Default color for the text fields
    var submitDefaultColor = submit.style.backgroundColor; //Default color for the submit button

    errortext.innerHTML = "";

    if (ValidateFields()) //If the form is valid
    {
        return true;
    }
    else //If the form is not valid
    {
        setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal if they were changed by the validation functions
        {
            username.style.backgroundColor = textDefaultColor;
            email.style.backgroundColor = textDefaultColor;
            submit.style.backgroundColor = submitDefaultColor;
        }, 500);

        return false;
    }
}

function ValidateFields()
{
    if (username.value == "" && email.value == "")
    {
        errortext.innerHTML += "Username OR Email must not be empty<br/>" //Add fail text
        
        username.style.backgroundColor = "red"; //Flash username field red
        email.style.backgroundColor = "red"; //Flash email field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }
    else if (username.value != "" && isNaN(username.value))
    {
        errortext.innerHTML += "Username must be a number<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }
    else if (username.value != "" && email.value != "")
    {
        errortext.innerHTML += "Please only enter text in Username OR Email<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        email.style.backgroundColor = "red"; //Flash email field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }

    return true;
}

function ForgotPassword()
{
    var myData = {
        MurdochUserNumber: username.value,
        Email: email.value,
    }

    errortext.innerHTML = "Sending Request..."; //Let the user know the server is waiting

    DoPost(scriptTarget, myData, PostSuccess, PostFail);

    return true;
}

function PostSuccess(reply)
{
    console.log(reply)
    var obj = JSON.parse(reply);

    if(obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if(obj.Status == "ok")
    {
        errortext.innerHTML = obj.Message;
        $("#submit-btn").hide();
    }

}

function PostFail(data, textStatus, errorMessage)
{
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}