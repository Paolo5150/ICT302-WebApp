var availableSlots = 8; //How many instrument containers are available
var instrumentOptions = ["Empty", "Suture Scissors", "Mayo Hegar Needle Driver", "Mayo Scissors", "Towel Clamps", "Scalpel", "Addson-Brown Forceps", "Metzembaum Scissors", "Rochester Carmalt Forceps"]; //What instruments can be placed in each slot

var errortext; //text area for displaying error messages
var layoutDropdown; //The dropdown for selecting which layout to save/load
var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slotDropdownContainer; //The 'ul' element containing the instrument slots
var save; //Form save button
var activeLayoutLabel; //Displays the currently active layout
var loadedLayoutLabel; //Displays the currently loaded layout
var lastLoadedLayout = "";
var instumentMarkers; //Markers of whether the instrument slot is filled

$(document).ready(function () {
    //find elements in document after it is ready
    layoutDropdown = document.getElementById("select-layout-dropdown");
    sizeDropdown = document.getElementById("select-size-dropdown");
    slotDropdownContainer = document.getElementById("slot-dropdown-container");
    errortext = document.getElementById("error-text");
    save = document.getElementById("save-layout-btn");
    activeLayoutLabel = document.getElementById("active-layout-label");
    loadedLayoutLabel = document.getElementById("loaded-layout-label");


    /* -----Init functions----- */
    FillSizeDropdown(availableSlots);
    BuildInstrumentSlots(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    GetAvailableLayouts();
    DisplayActiveLayout();
    UpdateInstrumentMarkers();

    /* -----Button callbacks----- */
    //Delete the selected layout from the server
    $("#new-layout-btn").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to create a new layout? Any unsaved changes will be lost"))
            NewLayout();
    })

    //Delete the selected layout from the server
    $("#delete-layout-btn").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to delete the layout: " + lastLoadedLayout + "?"))
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
        SaveLayout();
    })

    //Make this layout the active layout
    $("#activate-layout-btn").click(function (e) {
        e.preventDefault();
        SetActiveLayout(lastLoadedLayout);
    })

    $("#load-layout-btn").click(function (e) {
        e.preventDefault();
        if (confirm("Are you sure you want to load the layout \"" + layoutDropdown.options[layoutDropdown.selectedIndex].value + "\"? Any unsaved changes will be lost."))
            LoadServerLayout(layoutDropdown.options[layoutDropdown.selectedIndex].value);
    })

    /* -----Dropdown callbacks----- */
    $("#select-size-dropdown").on("change", function () {
        BuildInstrumentSlots(sizeDropdown.options[sizeDropdown.selectedIndex].value);
        UpdateInstrumentMarkers();
    })

    /* -----Button setup----- */
    $("#delete-layout-btn").prop("disabled", true);
    $("#activate-layout-btn").prop("disabled", true);
})

//Displays an alert to the user
function DisplayMessage(message) {
    //errortext = message;
    alert(message);
}

//Updates the markers that indicate if an instrument is in a slot
function UpdateInstrumentMarkers() {
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < list.length; i++) {
        var id = "#instrument-marker-" + (i + 1);

        $(id).removeAttr("hidden");
        if (list[i].getElementsByTagName("select")[0].value == "Empty")
            $(id).css("color", "red");
        else
            $(id).css("color", "green");
    }

    for (var i = 7; i >= list.length; i--) {
        var id = "#instrument-marker-" + (i + 1);
        $(id).prop("hidden", "true");
    }
}

//Creates a list of slots to put instruments in
function BuildInstrumentSlots(size) {
    slotDropdownContainer.innerHTML = "";

    for (var i = 0; i < size; i++) {
        var optionString = "";

        for (var j = 0; j < instrumentOptions.length; j++) {
            optionString += "<option id=\"option" + j + "\" value=\"" + instrumentOptions[j] + "\">" + instrumentOptions[j] + "</option>";
        }

        slotDropdownContainer.innerHTML += "<li>" + "Instrument in slot " + (i + 1) + ":<br>" + "<select class=\"layout-select\">" + optionString + "</select>" + "</li>";
    }

    $(".layout-select").on("change", function () {
        UpdateInstrumentMarkers();
    })
}

//Builds a list of slots and loads layout data into those slots
function LoadInstrumentLayout(data) {
    layout = data.split(",");
    BuildInstrumentSlots(layout.length);
    var list = slotDropdownContainer.getElementsByTagName("li");

    for (var i = 0; i < layout.length; i++) {
        list[i].getElementsByTagName("select")[0].value = layout[i];
    }

    UpdateInstrumentMarkers();
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

    if (optionString == "<option disabled selected value> -- Load a layout -- </option>") {
        optionString += "<option disabled id=\"no-layouts-option\" value=\"\">No Layouts Available</option>";
    }

    layoutDropdown.innerHTML = optionString;
}

//Prompts the user for a layout name and saves the current layout to the server
function SaveLayout() {
    var configName = "";

    if (lastLoadedLayout != "")
        configName = prompt("Please enter a new or existing name for the layout: ", lastLoadedLayout);
    else
        configName = prompt("Please enter a name for the layout: ", lastLoadedLayout);

    if (configName != null && configName != "") {
        var myData = {
            LayoutName: configName,
            Value: CreateLayoutString(false)
        }

        //DisplayMessage("Saving layout..."); //Let the user know the server is waiting

        DoPost("server/saveInstrumentLayout.php?", myData, (response) => {

            var obj = JSON.parse(response);

            if (obj.Status == "fail") {
                DisplayMessage(obj.Message);
                return false;
            }
            else if (obj.Status == "ok") {
                DisplayMessage(obj.Message);
                GetAvailableLayouts();
                loadedLayoutLabel.innerHTML = "Loaded layout: <b>" + configName + "</b>";
                //console.log(config);
                //console.log(layoutDropdown.value);
                layoutDropdown.value = configName;
                lastLoadedLayout = configName;
                //console.log(layoutDropdown.value);
                $("#delete-layout-btn").prop("disabled", false);
                $("#activate-layout-btn").prop("disabled", false);
                return true;
            }

            return false;

        },
            (data, status, error) => {
                DisplayMessage(status + ": " + error + ". Please try again or contact support.");
                return false;
            }
        )
    }
    else {
        if (lastLoadedLayout == "")
            $('#select-layout-dropdown').prop('selectedIndex', 0);
        else
            layoutDropdown.value = lastLoadedLayout;

        return false;
    }

    return false;
}

//Creates a new layout after a confirmation dialog
function NewLayout() {
    sizeDropdown.value = 1;
    lastLoadedLayout = "";
    loadedLayoutLabel.innerHTML = "No layout loaded";

    BuildInstrumentSlots(1);
    $('#select-layout-dropdown').prop('selectedIndex', 0);

    $("#delete-layout-btn").prop("disabled", true);
    $("#activate-layout-btn").prop("disabled", true);

    UpdateInstrumentMarkers();
}

//Deletes the currently selected layout from the server after a confirmation dialog
function DeleteLayout() {
    var myData = {
        LayoutName: lastLoadedLayout
    }

    DoPost("server/deleteInstrumentLayout.php", myData, (response) => {
        console.log(response)
        var obj = JSON.parse(response)

        if (obj.Status == "fail")
            DisplayMessage(obj.Message);
        else {
            DisplayMessage(obj.Message);

            GetAvailableLayouts();
            sizeDropdown.value = 1;
            lastLoadedLayout = "";
            loadedLayoutLabel.innerHTML = "No layout loaded";

            BuildInstrumentSlots(1);
            $('#select-layout-dropdown').prop('selectedIndex', 0);

            $("#delete-layout-btn").prop("disabled", true);
            $("#activate-layout-btn").prop("disabled", true);
            UpdateInstrumentMarkers();
        }

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
        }
    )
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
            layoutDropdown.value = configName;
            lastLoadedLayout = configName;
            loadedLayoutLabel.innerHTML = "Loaded layout: <b>" + configName + "</b>";
            sizeDropdown.value = obj.Data.Value.split(",").length;

            LoadInstrumentLayout(obj.Data.Value);

            $("#delete-layout-btn").prop("disabled", false);
            $("#activate-layout-btn").prop("disabled", false);
        }

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
        }
    )
}

//Retreives the name of the active layout from the server
function GetActiveLayout() {
    var myData = {}

    DoPost("server/getActiveInstrumentLayout.php?", myData, (response) => {

        var obj = JSON.parse(response);

        if (obj.Status == "fail")
            DisplayMessage(obj.Message);
        else
            LoadServerLayout(obj.Data.Value);

    },
        (data, status, error) => {
            DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            return obj.Message;
        }
    )
}

function DisplayActiveLayout() {
    var myData = {}

    DoPost("server/getActiveInstrumentLayout.php?", myData, (response) => {

        var obj = JSON.parse(response);

        if (obj.Status == "fail") {
            //DisplayMessage(obj.Message);
        }
        else {
            activeLayoutLabel.innerHTML = "Current Program Layout: <strong>" + obj.Data.Value + "</strong>";
        }

    },
        (data, status, error) => {
            //DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            //return obj.Message;
        }
    )
}

//Makes the currently selected layout as the active one
function SetActiveLayout(configName) {
    var configName = "";

    if (lastLoadedLayout != "")
        configName = prompt("Please enter a new or existing name for the layout: ", lastLoadedLayout);
    else
        configName = prompt("Please enter a name for the layout: ", lastLoadedLayout);

    if (configName != null && configName != "") {
        var myData = {
            LayoutName: configName,
            Value: CreateLayoutString(false)
        }

        //DisplayMessage("Saving layout..."); //Let the user know the server is waiting

        DoPost("server/saveInstrumentLayout.php?", myData, (response) => {

            var obj = JSON.parse(response);

            if (obj.Status == "fail") {
                DisplayMessage(obj.Message);
            }
            else if (obj.Status == "ok") {
                DisplayMessage(obj.Message);
                GetAvailableLayouts();
                loadedLayoutLabel.innerHTML = "Loaded layout: <b>" + configName + "</b>";
                //console.log(config);
                //console.log(layoutDropdown.value);
                layoutDropdown.value = configName;
                lastLoadedLayout = configName;
                //console.log(layoutDropdown.value);
                $("#delete-layout-btn").prop("disabled", false);
                $("#activate-layout-btn").prop("disabled", false);
                SaveActiveLayout(configName);
            }

        },
            (data, status, error) => {
                DisplayMessage(status + ": " + error + ". Please try again or contact support.");
            }
        )

    }
    else {
        if (lastLoadedLayout == "")
            $('#select-layout-dropdown').prop('selectedIndex', 0);
        else
            layoutDropdown.value = lastLoadedLayout;
    }
}

function SaveActiveLayout(configName) {
    if (configName != "") {
        var myData = {
            Value: configName
        }

        //DisplayMessage("Saving active layout..."); //Let the user know the server is waiting

        DoPost("server/saveActiveInstrumentLayout.php?", myData, (response) => {

            var obj = JSON.parse(response);

            if (obj.Status == "fail") {
                DisplayMessage(obj.Message);

            }
            else if (obj.Status == "ok") {
                DisplayActiveLayout();
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