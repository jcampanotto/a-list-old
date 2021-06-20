var resultsScreen = document.getElementById("resultsScreen");
var closeButton = document.getElementsByClassName("close")[1]; // Close button on Search Screen
var resultArray;
//var addButton;

// When user hits enter while searching or clicks search button
// Returns the data object containing the result of the search
function search(text) {
	if (event.keyCode == 13) {
		modal.style.display = "block";
		searchScreen.style.display = "none";
		resultsScreen.style.display = "block";

		// AJAX call to get data
		var url = "https://www.omdbapi.com/?apikey=54b7f917&t=" + text.value;
		var newCard; // string for new cards
		$.ajax({
			url: url,
			type: "GET",
		}).done(function(data) { // TODO empty result TODO the API only ever gives 1 result
			$("#resultsGrid").html("") // clears the html 
			newCard = '<div class="mdc-layout-grid__inner">'; // make a new grid row
			newCard += '<div class="mdc-layout-grid__cell">';
			newCard += '<div class="mdc-card">' + data.Title + '<br>'; 
			newCard += data.Released + '<br>';
			newCard += '<button class="mdc-button mdc-button--raised addButton" data-mdc-auto-init="MDCRipple"> Save </button>';
			newCard += '</div>';
			newCard += '</div>';
			newCard += '</div>';

			// Appending the new card
			$("#resultsGrid").append(newCard);
    		window.mdc.autoInit();

    		resultArray = [data.Title, data.Released]; // Used for save function. There's a better solution than this TODO
    		
		});
	}
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
    modal.style.display = "none";
}

/* Saving */
var db = new Dexie("saved"); // Setting up the DB
db.version(1).stores({
	movies: "title, date, rawDate"
});

function save() { // Saving into the DB
	db.movies.put({
		title: resultArray[0],
		date: resultArray[1],
		rawDate: Date.parse(resultArray[1]) // Parses date into a ms value from 1970. This will be used for sorting.
	});
}

// When the user clicks the save button 
$(document).on('click', '.addButton', function() {
	save();
	load();
})

/* Loading from DB */
function load() {
	var cardCounter = 0;
	var newCard = ""
	$("#cardsGrid").html("") // clears the html 
    db.movies.orderBy('rawDate').each(function(movie) { // this was actually pretty tough to do b/c the way append works
    	// Assume a new row
    	if (cardCounter % 3 == 0) {newCard = '<div class="mdc-layout-grid__inner">';}

    	newCard += '<div class="mdc-layout-grid__cell">';
    	newCard += '<div class="mdc-card">' + '<span class="title">' + movie.title + '</span>' + '<br>';
    	newCard += movie.date + '<br>';
    	newCard += '<button class="mdc-button mdc-button--raised removeButton" data-mdc-auto-init="MDCRipple"> Del </button>';
    	newCard += '</div>';
    	newCard += '</div>';

    	if (cardCounter % 3 == 2 && cardCounter != 0) {
    		$("#cardsGrid").append(newCard);
    	}

    	cardCounter++;

    }).then(function() {
	    if (cardCounter % 3 != 0) {
	    	$("#cardsGrid").append(newCard); // should automatically close
	    }

    });
}

/* Removing a card */
function remove(event) {
	var button = event.target;
	var title = $(button).parent().children(".title").text();
	db.movies.delete(title);

}

// When the user clicks the save button 
$(document).on('click', '.removeButton', function(event) {
	remove(event);
	load();
})
