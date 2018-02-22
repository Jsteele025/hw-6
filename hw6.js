
'use strict';
 

function buttonObject(text, searchString) {
    this.text = text;
    this.searchString = searchString;
};

var giphyAccess = {
    api_key: "YfyxamYpvZdmkE8dW4qmwU2VZWSsB4J1",        
    queryUrl: "https://api.giphy.com/v1/gifs/search",  
    
    ratings: ['y', 'g', 'pg', 'pg-13', 'r'], 
    
    default_rating: 1,           
    buttons: [],                
    

    makeApiCall: function (srchStr) {
        return $.ajax({
            url: srchStr,
            method: "GET"
        });
    },
    performSearch: function (button) {
        
        $.when(this.makeApiCall($(button).attr("data-search"))).done(function (results) {
            giphyAccess.displayResults(results);
        });
    },
    
    showButtons: function () {
        $('#buttons-view').empty();
        this.buttons.forEach(function (currentValue, idx) {
            var newButton = $("<button></button>")
                .attr("data-search", currentValue.searchString)
                .addClass("search-button").text(currentValue.text);

            $("#buttons-view").prepend(newButton);
        });

    },

    addSearchButton: function () {
        var searchTerm = $("#gif-search").val().trim(); 
        var maxRatings = $('input[name=ratings]:checked').val(); 
        var imgLimit = $("#image-limit").val().trim(); 

        var searchString = `${this.queryUrl}?q=${searchTerm}&rating=${ maxRatings }&limit=${ imgLimit }&api_key=${ this.api_key }`;
        
        this.buttons.push(new buttonObject(searchTerm, searchString));

        this.showButtons();
    },

    displayResults: function (results) {
        var container = $("#results-container"); 
        var images = results.data; 
        container.empty(); 
        if(images.length <= 0) {
            container.html("<h1>No results</h1>");
            return;
        }
        images.forEach(function (currentValue, idx) {

            var imgDiv = $("<div>").addClass("image-display");

            var image = $(`<img src="${ currentValue.images.fixed_height_still.url }" alt="Giphy Gif" class="gif-img" data-alt="${ currentValue.images.fixed_height.url }" />`)

            imgDiv.append(image);

            imgDiv.append(`<h2>Rating: ${ currentValue.rating }</h2>`)

            container.prepend(imgDiv);

        })
    },

  One will store the uri to a still image, the other to the animated.
    swapImages: function(imgContainer) {
        var tempImg = $(imgContainer).attr("src");
        var oldImg =  $(imgContainer).attr("data-alt");
        $(imgContainer).attr("src", oldImg);
        $(imgContainer).attr("data-alt", tempImg);
    },
}
var ga = giphyAccess;

function addRatings() {
    ga.ratings.forEach(function (currentValue, idx) {
        var prop = "";

        if (idx === ga.default_rating) {
            prop = "checked";
        }

        var newTag = `<input type="radio" class="upto-rating" value="${ currentValue }" name="ratings" ${ prop }> ${currentValue }<br />`;
        $("#ratings-select").append(newTag);

    })
}


function startupSite() {
    addRatings();
    $("#buttons-view").empty();
    $("#results-container").empty();
}

$(document).on("click", ".gif-img", function(e) {
    ga.swapImages(this);
});

$("#search-button").on("click", function (e) {
    e.preventDefault();
    ga.addSearchButton();
    $("#gif-search").val("").focus();
});


$("#buttons-view").on("click", ".search-button", function () {
    ga.performSearch(this);
}); 

$(document).ready(startupSite);