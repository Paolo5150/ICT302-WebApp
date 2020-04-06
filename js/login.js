var username = document.getElementById("username"); //Username field
var password = document.getElementById("password"); //Password field
var errortext = document.getElementById("errortext"); //errortext entry text
var submit = document.getElementById("submit"); //Form submit button

var server = "../server/";
var script = "login.php?";

$("#errortext").hide();

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
    $("#errortext").hide();

    if (username.value != "" && password.value != "" && ValidatePassword(password.value) && ValidateUsername(username.value)) //If the form is valid
    {
        var success = Login();
    }
    else //If the form is not valid
    {
        var textDefaultColor = username.style.backgroundColor; //Default color for the text fields
        var submitDefaultColor = submit.style.backgroundColor; //Default color for the submit button
        
        if (username.value == "")
        {
            username.select(); //Select the username again so the user can quickly change the name
            errortext.innerHTML += "Username must not be empty<br/>" //Add fail text
            
            username.style.backgroundColor = "red"; //Flash username field red
            submit.style.backgroundColor = "red"; //Flash submit button red
        }
        
        if (password.value == "")
        {
            password.select(); //Select the password again so the user can quickly change the password
            errortext.innerHTML += "Password must not be empty<br/>" //Add fail text

            password.style.backgroundColor = "red"; //Flash password field red
            submit.style.backgroundColor = "red"; //Flash submit button red
        }

        $("#errortext").slideDown(1000);

        setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal
        {
            username.style.backgroundColor = textDefaultColor;
            password.style.backgroundColor = textDefaultColor;
            submit.style.backgroundColor = submitDefaultColor;
        }, 500);

        setTimeout(function () //After 3 seconds, remove the fail text
        {
            $("#errortext").slideUp(1000);
        }, 4000);
    }
}

function ValidateUsername()
{
    if (isNaN(username.value))
    {
        username.select(); //Select the username again so the user can quickly change the username
        errortext.innerHTML += "Username must be a number<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red
        return false;
    }

    return true;
}

function ValidatePassword()
{
    console.warn("Password validation is currently disabled");
    return true; //Debug until rules in place

    if (password.value)
    {
        password.select(); //Select the password again so the user can quickly change the password
        errortext.innerHTML += "Password must be <br/>" //Add fail text

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

    DoPost("server/login.php", myData, PostSuccess, PostFail);

    return true;
}

function PostSuccess(reply)
{
    console.log("Success: " + reply);
}

function PostFail(data, textStatus, errorMessage)
{
    // console.log("Failed");
    // console.log(data);
    // console.log(textStatus);
    // console.log(errorMessage);
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

    $("#invalid").slideDown(1000);

    setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal
    {
        username.style.backgroundColor = textDefaultColor;
        password.style.backgroundColor = textDefaultColor;
        submit.style.backgroundColor = submitDefaultColor;
    }, 500);

    setTimeout(function () //After 3 seconds, remove the fail text
    {
        $("#invalid").slideUp(1000);
    }, 4000);

}