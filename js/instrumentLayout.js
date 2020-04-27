var availableSlots = 14; //How many instrument slots are available
var instrumentOptions = ["Scissors", "Needle", "SomethingElse"]; //What instruments can be placed in each slot

var sizeDropdown; //The dropdown for selecting how many instruments will be in the scene
var slots; //The


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

    FillSize(availableSlots);
    BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);

    $("#selectSizeDropdown").on("change", function () {
        BuildLayoutList(sizeDropdown.options[sizeDropdown.selectedIndex].value);
    })
})