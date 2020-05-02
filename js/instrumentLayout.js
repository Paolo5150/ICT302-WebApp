var availableSlots = 14; //How many instrument containers are available
var instrumentOptions = ["Empty", "Suture Scissors", "Mayo Hegar Needle Driver", "Mayo Scissors", "Towel Clamps", "Scalpel", "Addson-Brown Forceps", "Metzembaum Scissors", "Rochester Carmalt Forceps", "Mayo Scissor"]; //What instruments can be placed in each slot

var errortext; //text area for displaying error messages
var layoutDropdown; //The dropdown for selecting which layout to save/load
var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slotDropdownContainer; //The 'ul' element containing the instrument slots
var save; //Form save button

$(document).ready(function () {
    //find elements in document after it is ready
    layoutDropdown = document.getElementById("select-layout-dropdown");
    sizeDropdown = document.getElementById("select-size-dropdown");
    slotDropdownContainer = document.getElementById("slot-dropdown-container");
    errortext = document.getElementById("error-text")
    save = document.getElementById("save-layout-btn");

    /* -----Init functions----- */
    FillSizeDropdown(availableSlots);
    BuildInstrumentSlots(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    GetAvailableLayouts();

    /* -----Button callbacks----- */
    //Delete the selected layout from the server
    $("#delete-layout-btn").click(function (e) {
        e.preventDefault();
        DeleteLayout();
    })

    //Pull the currently saved layout from the database
    $("#load-active-btn").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to load the active layout? Any unsaved changes will be lost."))
            GetActiveLayout();
    })

    //Save the current layout to the server
    $("#save-layout-btn").click(function (e) {
        e.preventDefault();
        if (ValidateForm()) {
            SaveLayout();
        }
    })

    //Make this layout the active layout
    $("#activate-layout-btn").click(function (e) {
        e.preventDefault();
        SaveActiveLayout(layoutDropdown.options[layoutDropdown.selectedIndex].value);
    })

    /* -----Dropdown callbacks----- */
    $("#select-layout-dropdown").on("change", function () {
        if (confirm("Are you sure you want to load the layout \"" + layoutDropdown.options[layoutDropdown.selectedIndex].value + "\"? Any unsaved changes will be lost."))
            LoadServerLayout(layoutDropdown.options[layoutDropdown.selectedIndex].value);
    })

    $("#select-size-dropdown").on("change", function () {
        BuildInstrumentSlots(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    })
})

//Displays an alert to the user
function DisplayMessage(message) {
    //errortext = message;
    alert(message);
}

//Creates a list of slots to put instruments in
function BuildInstrumentSlots(size) {
    slotDropdownContainer.innerHTML = "";

    for (var i = 0; i < size; i++) {
        var optionString = "";

        for (var j = 0; j < instrumentOptions.length; j++) {
            optionString += "<option id=\"option" + j + "\" value=\"" + instrumentOptions[j] + "\">" + instrumentOptions[j] + "</option>";
        }

        slotDropdownContainer.innerHTML += "<li>" + "Instrument in slot " + (i + 1) + ":<br>" + "<select>" + optionString + "</select>" + "</li>";
    }
}

//Builds a list of slots and loads layout data into those slots
function LoadInstrumentLayout(data) {
    layout = data.split(",");
    BuildInstrumentSlots(layout.length);
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < layout.length; i++) {
        var select = list[i].getElementsByTagName("select")[0].value = layout[i];
    }
}

//Fills the max instruments selector with 'size' options
function FillSizeDropdown(size) {
    sizeDropdown.innerHTML = "";
    for (var i = 1; i <= size; i++) {
        sizeDropdown.innerHTML += "<option value=\"" + i.toString() + "\">" + i.toString() + "</option>";
    }
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

//Validates the instrument form before submission
function ValidateForm() {

    if (CheckForDuplicates(slotDropdownContainer.getElementsByTagName("li"))) {
        DisplayMessage("All instruments slots must have unique values");
        return false;
    }
    else {
        return true;
    }
}

//Returns a comma seperated list of all the instruments selected
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

//Loads the list of all available layouts from the server
function GetAvailableLayouts() {
    var myData = {}

    DoPost("server/getInstrumentLayoutList.php", myData, (response) => {

        var obj = JSON.parse(response);
        var data = ""; //We'll send a blank string to the available layout loader if the json parse fails

        try {
            data = JSON.parse(obj.Data); //If the json parse fails because there is no data we can ignore it
        } catch (error) {
            console.log(error);
        }

        LoadAvailableLayouts(data);
        if (obj.Status == "fail")
            DisplayMessage(obj.Message);

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
        }
    )
}

//Fills the layout selector dropdown with the layouts stored on the server
function LoadAvailableLayouts(layouts) {
    layoutDropdown.innerHTML = "";

    var optionString = "<option disabled selected value> -- Load a layout -- </option>";

    for (var i = 0; i < layouts.length; i++) {
        optionString += "<option id=\"layoutOption" + i + "\" value=\"" + layouts[i] + "\">" + layouts[i] + "</option>";
    }

    if (optionString == "") {
        optionString = "<option id=\"no-layouts-option\" value=\"\">No Layouts Available</option>";
        $("#delete-layout-btn").prop("disabled", true);
    }
    else {
        $("#delete-layout-btn").prop("disabled", false);
    }

    layoutDropdown.innerHTML = optionString;
}

//Prompts the user for a layout name and saves the current layout to the server
function SaveLayout() {
    var config = prompt("Please enter a new or existing name for the layout: ", layoutDropdown.options[layoutDropdown.selectedIndex].value);

    if (config != null && config != "") {
        var myData = {
            LayoutName: config,
            Value: CreateLayoutString(false)
        }

        //DisplayMessage("Saving layout..."); //Let the user know the server is waiting

        DoPost("server/saveInstrumentLayout.php?", myData, (response) => {

            var obj = JSON.parse(response);

            if (obj.Status == "fail")
                DisplayMessage(obj.Message);
            else if (obj.Status == "ok") {
                DisplayMessage(obj.Message);
                GetAvailableLayouts();
                console.log(config);
                console.log(layoutDropdown.value);
                layoutDropdown.value = config;
                console.log(layoutDropdown.value);
            }

        },
            (data, status, error) => {
                DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            }
        )
    }
}

//Deletes the currently selected layout from the server after a confirmation dialog
function DeleteLayout() {
    var myData = {
        LayoutName: layoutDropdown.options[layoutDropdown.selectedIndex].value
    }

    if (confirm("Are you sure you want to delete the layout: " + layoutDropdown.options[layoutDropdown.selectedIndex].innerHTML + "?")) {
        DoPost("server/deleteInstrumentLayout.php", myData, (response) => {

            var obj = JSON.parse(response)

            if (obj.Status == "fail")
                DisplayMessage(obj.Message);
            else {
                DisplayMessage(obj.Message);
                GetAvailableLayouts();
                sizeDropdown.value = 1;
                BuildInstrumentSlots(1);
            }

        },
            (data, status, error) => {
                DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            }
        )
    }
}

//Loads the dropdown selected layout from the server
function LoadServerLayout(configName) {
    var myData = {
        LayoutName: configName
    }

    //DisplayMessage("Getting layout from server..."); //Let the user know the server is waiting

    DoPost("server/getInstrumentLayout.php?", myData, (response) => {

        var obj = JSON.parse(response);

        if (obj.Status == "fail")
            DisplayMessage(obj.Message);
        else {
            console.log(configName);
            console.log(layoutDropdown.value);
            layoutDropdown.value = configName;
            console.log(layoutDropdown.value);
            sizeDropdown.value = obj.Data.Value.split(",").length;
            LoadInstrumentLayout(obj.Data.Value);
        }

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
        }
    )
}

//Loads the active layout from the server
function GetActiveLayout() {
    var myData = {}

    DoPost("server/getActiveInstrumentLayout.php?", myData, (response) => {

        var obj = JSON.parse(response);

        if (obj.Status == "fail")
            DisplayMessage(obj.Message);
        else {
            LoadServerLayout(obj.Data.Value);
        }

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
        }
    )
}

//Makes the currently selected layout as the active one
function SaveActiveLayout(configName) {
    if (configName != "") {
        var myData = {
            Value: configName
        }

        //DisplayMessage("Saving active layout..."); //Let the user know the server is waiting

        DoPost("server/saveActiveInstrumentLayout.php?", myData, (response) => {

            var obj = JSON.parse(response);

            if (obj.Status == "fail")
                DisplayMessage(obj.Message);
            else if (obj.Status == "ok") {
                DisplayMessage(obj.Message);
            }

        },
            (data, status, error) => {
                DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            }
        )

    }
    else {
        DisplayMessage("To create an active layout, please select or create a layout");
    }
}