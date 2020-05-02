var username = document.getElementById("username"); //Username field
var password = document.getElementById("password"); //Password field
var errortext = document.getElementById("errortext"); //errortext entry text
var submit = document.getElementById("submit-btn"); //Form submit button

var loginScriptTarget = "server/login.php?"; //The login script location

$(document).ready(function () {

    $("#submit-btn").click(function(e){

        e.preventDefault();
        if(ValidateForm())
            Login();
    })
})

function ValidateForm()
{
    var textDefaultColor = username.style.backgroundColor; //Default color for the text fields
    var submitDefaultColor = submit.style.backgroundColor; //Default color for the submit button

    errortext.innerHTML = "";

    if (ValidateUsername(username.value) & ValidatePassword(password.value)) //If the form is valid
    {
        return true;
    }
    else //If the form is not valid
    {
        setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal if they were changed by the validation functions
        {
            username.style.backgroundColor = textDefaultColor;
            password.style.backgroundColor = textDefaultColor;
            submit.style.backgroundColor = submitDefaultColor;
        }, 500);

        return false;
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
        Password: password.value,
        Captcha: grecaptcha.getResponse()
    }

   
    errortext.innerHTML = "Logging in..."; //Let the user know the server is waiting

    DoPost(loginScriptTarget, myData, PostSuccess, PostFail);

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
        localStorage.setItem("Token",obj.Data.Token)
        localStorage.setItem("MurdochUserNumber",obj.Data.MurdochUserNumber)
        window.location = "index.php"; // Refresh this page. Redirection is done by server

    }

    grecaptcha.reset()

}

function PostFail(data, textStatus, errorMessage)
{
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
    
}