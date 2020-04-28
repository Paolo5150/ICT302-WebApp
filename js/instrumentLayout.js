var availableSlots = 14; //How many instrument slot-dropdown-container are available
var instrumentOptions = ["Empty", "Scissors", "Needle", "SomethingElse"]; //What instruments can be placed in each slot

var errortext; //text area for displaying error messages
var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slotDropdownContainer; //The drop
var save; //Form save button

//var layoutScriptTarget = "server/SCRIPT.php?"; //The login script location


function BuildLayoutList(size) {
    slotDropdownContainer.innerHTML = "";

    for (var i = 0; i < size; i++) {
        var optionString = "";

        for (var j = 0; j < instrumentOptions.length; j++) {
            optionString += "<option id=\"option" + j + "\" value=\"" + instrumentOptions[j] + "\">" + instrumentOptions[j] + "</option>";
        }

        slotDropdownContainer.innerHTML += "<li>" + "Instrument in slot " + (i + 1) + ":<br>" + "<select>" + optionString + "</select>" + "</li>";
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

//Checks whether any dropdown boxes are set to the same value as each other and highlights both red, returns true if there are duplicates
function CheckForDuplicates(list) {
    var defaultColor = save.style.backgroundColor; //Default color for the save button
    var invalid = false; //seperate bool so all invalid dropdowns will get highlighted

    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list.length; j++) {
            var selectA = list[i].getElementsByTagName("select")[0];
            var selectedOptionA = selectA.options[selectA.selectedIndex].value;
            var selectB = list[j].getElementsByTagName("select")[0];
            selectedOptionB = selectB.options[selectB.selectedIndex].value;

            //if two different dropdowns are set to the same option
            if (i != j && (selectedOptionA != "Empty" || selectedOptionB != "Empty") && selectedOptionA == selectedOptionB) {
                selectA.style.backgroundColor = "red";
                selectB.style.backgroundColor = "red";
                save.style.backgroundColor = "red";

                invalid = true;
            }
        }
    }

    //Returns all dropdowns and the save button to the specified colour after a specified amount of milliseconds
    setTimeout(function () //After "milliseconds" milliseconds, set the elements' colors back to normal if they were changed by the validation functions
    {
        for (var i = 0; i < list.length; i++) {
            list[i].getElementsByTagName("select")[0].style.backgroundColor = defaultColor;
        }

        save.style.backgroundColor = defaultColor;
    }, 500);

    return invalid;
}

$(document).ready(function () {
    //find elements in document after it is ready
    sizeDropdown = document.getElementById("select-size-dropdown");
    slotDropdownContainer = document.getElementById("slot-dropdown-container");
    errortext = document.getElementById("error-text")
    save = document.getElementById("save-btn");

    //Return the form to the currently saved setup
    //Pull the currently saved layout from the database here
    // $("#reset-btn").click(function (e) {
    //     e.preventDefault();
    //     if (ResetForm())
    //         console.log("Reset form");
    // })

    //Save the current setup to the server
    $("#save-btn").click(function (e) {
        e.preventDefault();
        if (ValidateForm())
        {
            console.log("Valid form");
            console.log(GetLayoutString());
        }
        else
            console.log("Invalid form");
    })

    FillSize(availableSlots);
    BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);

    $("#select-size-dropdown").on("change", function () {
        BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    })
})

function ValidateForm() {

    if (CheckForDuplicates(slotDropdownContainer.getElementsByTagName("li"))) {
        errortext.innerHTML = "All instruments slots must have unique values";
        return false;
    }
    else {
        errortext.innerHTML = "";
        return true;
    }
}

//Returns a list of all the instruments selected
function GetLayoutString(list) {
    var layoutString = "";
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < list.length; i++) {
        var select = list[i].getElementsByTagName("select")[0];
        layoutString += select.options[select.selectedIndex].value + ",";
    }

    layoutString = layoutString.substring(0, layoutString.length - 1); //Remove the last comma

    return layoutString;
}

function GetCurrentLayout() {
    var myData = {
        MurdochUserNumber: username.value,
        Password: password.value,
        Captcha: grecaptcha.getResponse()
    }

    errortext.innerHTML = "Getting layout from server..."; //Let the user know the server is waiting

    DoPost(layoutScriptTarget, myData, GetLayoutSuccess, GetLayoutFail);

    return true;
}

function GetLayoutSuccess(reply) {
    console.log(reply)
    var obj = JSON.parse(reply);

    if (obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if (obj.Status == "ok") {
        errortext.innerHTML = "";
        localStorage.setItem("Token", obj.Data.Token)
        localStorage.setItem("MurdochUserNumber", obj.Data.MurdochUserNumber)
        window.location = "index.php"; // Refresh this page. Redirection is done by server

    }
}

function GetLayoutFail(data, textStatus, errorMessage) {
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}

function SaveLayout() {
    var myData = {
        Layout: GetLayoutString()
    }

    errortext.innerHTML = "Saving layout..."; //Let the user know the server is waiting

    DoPost(layoutScriptTarget, myData, SaveLayoutSuccess, SaveLayoutFail);

    return true;
}

function SaveLayoutSuccess(reply) {
    console.log(reply)
    var obj = JSON.parse(reply);

    if (obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if (obj.Status == "ok") {
        errortext.innerHTML = "";
        localStorage.setItem("Token", obj.Data.Token)
        localStorage.setItem("MurdochUserNumber", obj.Data.MurdochUserNumber)
        window.location = "index.php"; // Refresh this page. Redirection is done by server

    }
}

function SaveLayoutFail(data, textStatus, errorMessage) {
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}