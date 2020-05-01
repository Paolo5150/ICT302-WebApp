var availableSlots = 14; //How many instrument slot-dropdown-container are available
var instrumentOptions = ["Empty", "Scissors", "Needle", "SomethingElse"]; //What instruments can be placed in each slot

var errortext; //text area for displaying error messages
var layoutDropdown; //The dropdown for selecting which layout to save/load
var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slotDropdownContainer; //The 'ul' element containing the instrument slots
var save; //Form save button NOT NEEDED?

var saveLayoutScriptTarget = "server/saveInstrumentLayout.php?"; //The layout script location for saving the layout to the server
var getLayoutScriptTarget = "server/getInstrumentLayout.php?"; //The layout script location for getting the layout from the server


$(document).ready(function () {
    //find elements in document after it is ready
    layoutDropdown = document.getElementById("select-layout-dropdown");
    sizeDropdown = document.getElementById("select-size-dropdown");
    slotDropdownContainer = document.getElementById("slot-dropdown-container");
    errortext = document.getElementById("error-text")
    save = document.getElementById("save-btn");

    //Load the selected layout from the server
    $("#load-layout-btn").click(function (e) {
        e.preventDefault();
        if (LoadServerLayout())
            console.log("Valid layout");
        else
            console.log("Invalid form");
    })

    //Delete the selected layout from the server
    $("#delete-layout-btn").click(function (e) {
        e.preventDefault();
        DeleteLayout();
    })

    //Pull the currently saved layout from the database
    $("#reset-btn").click(function (e) {
        e.preventDefault();
        //GetActiveLayout();
        //sizeDropdown.value = 1;
        LoadLayoutList()
    })

    //Save the current layout to the server
    $("#save-btn").click(function (e) {
        e.preventDefault();
        if (ValidateForm()) {
            SaveLayout();
        }
    })

    //Make this layout the active layout
    $("#activate-layout-btn").click(function (e) {
        e.preventDefault();
        SetActiveLayout();
    })

    FillSizeDropdown(availableSlots);
    BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);

    $("#select-size-dropdown").on("change", function () {
        BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    })
})

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

function LoadInstrumentLayout(data) {
    layout = data.split(",");
    BuildLayoutList(layout.length);
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < layout.length; i++) {
        var select = list[i].getElementsByTagName("select")[0].value = layout[i];
    }
}

function LoadLayoutList(layouts)
{
    DoPost("server/getInstrumentLayoutList.php", (response) => {

        var obj = JSON.parse(response)

        if (obj.Status == "fail")
            errortext.innerHTML = obj.Message;
        else {
            console.log("Suc");
            errortext.innerHTML = obj.Message;
            //for(var i = 0; i < data.LayoutID)
            console.log(data);
        }

    },
        (data, status, error) => {
            errortext.innerHTML = status + ": " + error + ". Please try again or contact support.";
        }
    )
}

function FillSizeDropdown(size) {
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
function CreateLayoutString(ignoreEmpty = true) {
    var layoutString = "";
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < list.length; i++) {
        var select = list[i].getElementsByTagName("select")[0];
        var value = select.options[select.selectedIndex].value;

        //Don't save empties unless we specifically want them
        if (value != "Empty" || ignoreEmpty == false)
            layoutString += select.options[select.selectedIndex].value + ",";
    }

    layoutString = layoutString.substring(0, layoutString.length - 1); //Remove the last comma

    return layoutString;
}

function SaveLayout() {
    var id = prompt("Please enter a new or existing name for the layout: ");
    
    var myData = {
        LayoutID: id,
        Layout: CreateLayoutString(false)
    }

    errortext.innerHTML = "Saving layout..."; //Let the user know the server is waiting

    DoPost(saveLayoutScriptTarget, myData, SaveLayoutSuccess, SaveLayoutFail);

    return true;
}

function SaveLayoutSuccess(reply) {
    console.log(reply)
    var obj = JSON.parse(reply);

    if (obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else if (obj.Status == "ok") {
        errortext.innerHTML = obj.Message;
    }
}

function SaveLayoutFail(data, textStatus, errorMessage) {
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}

function DeleteLayout() {
    var myData = {
        LayoutID: layoutDropdown.options[layoutDropdown.selectedIndex].value
    }

    if (confirm("Are you sure you want to delete the layout: " + layoutDropdown.options[layoutDropdown.selectedIndex].innerHTML + "?")) {
        DoPost("server/deleteInstrumentLayout.php", myData, (response) => {

            var obj = JSON.parse(response)

            if (obj.Status == "fail")
                errortext.innerHTML = obj.Message;
            else {
                errortext.innerHTML = obj.Message;
                sizeDropdown.value = 1;
                BuildLayoutList(1);
            }

        },
            (data, status, error) => {
                errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
            }
        )
    }
}

function LoadServerLayout() {
    var myData = {
        LayoutID: layoutDropdown.options[layoutDropdown.selectedIndex].value
    }

    errortext.innerHTML = "Getting layout from server..."; //Let the user know the server is waiting

    DoPost(getLayoutScriptTarget, myData, GetLayoutSuccess, GetLayoutFail);
}

function GetLayoutSuccess(reply) {
    var obj = JSON.parse(reply);

    if (obj.Status == "fail")
        errortext.innerHTML = obj.Message;
    else {
        errortext.innerHTML = "";
        LoadInstrumentLayout(obj.Data.Layout);
    }
}

function GetLayoutFail(data, textStatus, errorMessage) {
    errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
}

function GetActiveLayout() {
    var myData = {
        LayoutID: "ActiveLayout"
    }

    errortext.innerHTML = "Getting layout from server..."; //Let the user know the server is waiting

    DoPost(getLayoutScriptTarget, myData, (response) => {

        var obj = JSON.parse(response)

        if (obj.Status == "fail")
            errortext.innerHTML = obj.Message;
        else {
            errortext.innerHTML = obj.Message;
            sizeDropdown.value = 1;
            BuildLayoutList(1);
        }

    },
        (data, status, error) => {
            errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
        }
    )
}

function SetActiveLayout() {
    // var myData = {
    //     LayoutID: layoutDropdown.options[layoutDropdown.selectedIndex].value,
    //     Layout: CreateLayoutString()
    // }

    // errortext.innerHTML = "Saving layout..."; //Let the user know the server is waiting

    // DoPost(saveLayoutScriptTarget, myData, SaveLayoutSuccess, SaveLayoutFail);

    // return true;
}

// function GetLayoutSuccess(reply) {
//     console.log(reply);
//     var obj = JSON.parse(reply);

//     if (obj.Status == "fail")
//         errortext.innerHTML = obj.Message;
//     else {
//         errortext.innerHTML = "";
//         console.log(obj);
//         console.log(obj.Data.Layout);
//         LoadInstrumentLayout(obj.Data.Layout);
//     }
// }

// function GetLayoutFail(data, textStatus, errorMessage) {
//     errortext.innerHTML = textStatus + ": " + errorMessage + ". Please try again or contact support.";
// }