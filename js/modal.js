/*
This works by displaying a modal box when the FAB is clicked. Inside this box the two additional screens with ID searchScreen and resultsScreen will be displayed at certain points. The hierarchy looks like this:
	
	FAB -> searchScreen -> resultsScreen

Clicking anywhere (except the topappbar) outside of the modal box closes the modal box.

The closeButton variable contains the close button. This needs to be modified TODO 

*/

var modal = document.getElementById('myModal'); // Modal Selector using JS; this is the modal box described above
var fabButton = document.getElementById("fabAdd"); // FAB selector
var closeButton = document.getElementsByClassName("close")[0]; // Close button on Search Screen
var searchScreen = document.getElementById("searchScreen");
var resultsScreen = document.getElementById("resultsScreen");

// Fab click opens search
fabButton.onclick = function() {
	modal.style.display = "block";
	searchScreen.style.display = "block";
	resultsScreen.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}