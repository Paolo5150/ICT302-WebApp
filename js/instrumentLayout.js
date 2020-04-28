var availableSlots = 14; //How many instrument slots are available
var instrumentOptions = ["Scissors", "Needle", "SomethingElse"]; //What instruments can be placed in each slot
var errortext = document.getElementById("errortext"); //errortext entry text

var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slots; //The
var submit; //Form submit button


function BuildLayoutList(size) {
    slots.innerHTML = "";

    for (var i = 0; i < size; i++) {
        var optionString = "";

        for (var j = 0; j < instrumentOptions.length; j++) {
            optionString += "<option id=\"option" + j + "\" value=\"" + instrumentOptions[j] + "\">" + instrumentOptions[j] + "</option>";
        }

        slots.innerHTML += "<li>" + "Instrument in slot " + (i + 1) + ":<br>" + "<select>" + optionString + "</select>" + "</li>";
    }
}

function FillSize(size) {
    //sizeDropdown = "<select id=\"size\">";
    sizeDropdown.innerHTML = "";
    for (var i = 1; i <= size; i++) {
        sizeDropdown.innerHTML += "<option value=\"" + i.toString() + "\">" + i.toString() + "</option>";
    }
    //sizeDropdown += "</select>";
}

//Checks whether any dropdown boxes are set to the same value as each other and highlights both red
function CheckForDuplicates() {

}

$(document).ready(function () {
    sizeDropdown = document.getElementById("selectSizeDropdown");
    slots = document.getElementById("slots");
    submit = document.getElementById("submit-btn");

    $("#submit-btn").click(function (e) {

        e.preventDefault();
        if (ValidateForm())
            console.log("Valid");
        else
            console.log("Invalid");
    })

    FillSize(availableSlots);
    BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);

    $("#selectSizeDropdown").on("change", function () {
        BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    })
})

function ValidateForm() {
    var defaultColor = submit.style.backgroundColor; //Default color for the submit button

    //errortext.innerHTML = "";

    var list = slots.getElementsByTagName("li");
    var invalid = false; //seperate bool so all invalid dropdowns will get highlighted

    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list.length; j++) {
            var selectA = list[i].getElementsByTagName("select")[0];
            var selectB = list[j].getElementsByTagName("select")[0];

            if (i != j && selectA.options[selectA.selectedIndex].value == selectB.options[selectB.selectedIndex].value) {
                selectA.style.backgroundColor = "red";
                selectB.style.backgroundColor = "red";
                submit.style.backgroundColor = "red";

                invalid = true;
            }
        }
    }

    setTimeout(function () //After 0.5 seconds, set the elements' colors back to normal if they were changed by the validation functions
    {
        for (var i = 0; i < list.length; i++) {
            console.log(list[i].getElementsByTagName("select")[0]);
            list[i].getElementsByTagName("select")[0].style.backgroundColor = defaultColor;
        }

        submit.style.backgroundColor = defaultColor;
    }, 500);

    return !invalid;
}

function ExportLayout() {

}

function ValidateUsername() {
    if (username.value == "") {
        errortext.innerHTML += "Username must not be empty<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }
    else if (isNaN(username.value)) {
        errortext.innerHTML += "Username must be a number<br/>" //Add fail text

        username.style.backgroundColor = "red"; //Flash username field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }

    return true;
}

function ValidatePassword() {
    if (password.value == "") {
        errortext.innerHTML += "Password must not be empty<br/>" //Add fail text

        password.style.backgroundColor = "red"; //Flash password field red
        submit.style.backgroundColor = "red"; //Flash submit button red

        return false;
    }

    return true;
}

function Login() {
    var myData = {
        MurdochUserNumber: username.value,
        Password: password.value,
        Captcha: grecaptcha.getResponse()
    }

    errortext.innerHTML = "Logging in..."; //Let the user know the server is waiting

    DoPost(loginScriptTarget, myData, PostSuccess, PostFail);

    return true;
}

function PostSuccess(reply) {
    console.log(reply)
    var obj = JSON.parse(reply);

    if (obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if (obj.Status == "ok") {
        localStorage.setItem("Token", obj.Data.Token)
        localStorage.setItem("MurdochUserNumber", obj.Data.MurdochUserNumber)
        window.location = "index.php"; // Refresh this page. Redirection is done by server

    }
}

function PostFail(data, textStatus, errorMessage) {
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}