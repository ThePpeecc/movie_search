/*jshint esnext: true */
/**
 * This file holds the search and ui logic for the movie search application
 *
 * @summary   The module runs the movie search functionality aswell as the Ui functionallity
 *
 * @link      URL
 * @since     07.10.2016
 * @requires jquery-3.1.0.js
 **/

/**
 * @desc This is the module that holds the ui and conectivity functionallity.
 * @param No parameters is needed since it is just a standalone module
 * @return nil. We dont return anything
 */
var movieSearch = ! function() {
    "use strict";

    var url = 'http://www.omdbapi.com/'; //The standard url

    /**
     * @desc This is the click event. The evet is activated when the user clicks
     *        on the image poster for any movie
     *
     * @param  {Event} event Mouse click event
     * @return {nil}         We don't return anything
     */
    var movieDescription = function( event ) {

      /**
       * The data we send with the ajax get request
       * @type {Object}
       */
      var data = {
        i: $(event.target).parent().attr('alt'),
        plot: 'full',
        r: 'json'
      };

      /**
       * This callback function loads all of the returned json data into
       * the correct locations, and show the description page afterwards
       *
       * @param  {Objec} json        The JSON object with our data
       * @param  {String} textStatus The status of the ajax request (if it succeeded)
       * @return {nil}               We don't retrun anything
       */
      var loadDescription = function(json, textStatus) {
        if (textStatus === 'success') { //If the ajax request was successfull
          //Here we load all of the different data points into their respective locations
          $('.description-img img').attr('src', json.Poster);
          $('.description-top h1').text(json.Title.toUpperCase() + ' (' + json.Year + ')');
          $('.description-top p').text('IMDb Rating: ' + json.imdbRating);
          $('.description-bottom p').text(json.Plot);
          $('.description-bottom a').attr('href', 'http://www.imdb.com/title/' + json.imdbID +'/');
          $('.movie-description').slideDown('slow'); //We show the description page
        }
      };

      $.getJSON(url, data,loadDescription); //Start the ajax request
    };

    //The hide button on the description page
    $('#hideDesc').click(function(event) {
      $('.movie-description').slideUp('slow'); //We hide the description page
    });

    $('form').submit(function(event) { //The form is submitted
        event.preventDefault();
        /**
         * @desc The data object that we send with te get request with our search values
         * @type {Object}
         */
        var data = {
            s: $('#search')[0].value,
            y: $('#year')[0].value,
            r: 'json'
        };

        /**
         * @desc This callback function takes care of the ui when loading a movie
         * @param  {Object} json       The JSON data that we get back from our request
         * @param  {String} textStatus The status of the ajax request (if it succeeded)
         * @return {Nil}               We don't return anything
         */
        var uiFunction = function(json, textStatus) {
            console.log(json);
            $('#movies').empty(); //We empty the movies for any old movies from previos searches
            if (textStatus === 'success') { //If the ajax request was successfull
                var returnHTML = "";
                if (json.Response === "False") { //If we did not find any movie
                    //We return the no movies found list item
                    returnHTML = '<li class="no-movies"><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + $('#search')[0].value + '.</li>';
                } else {
                    $.each(json.Search, function(index, serchResult) { //We run throgh all the returned movies
                      /*
                       * The next couple lines of code are pretty much just jamming a list item
                       * together with the different data parts that we received
                       *
                       * The only real logic here is the .Poster part, since we may or may not receive a poster link
                       * So we have to tjek if there is a poster or not
                       */
                        returnHTML += '<li><div class="poster-wrap" alt="' + serchResult.imdbID + '">';
                        if (serchResult.Poster === "N/A") {
                            returnHTML += '<i class="material-icons poster-placeholder">crop_original</i>';
                        } else {
                            returnHTML += '<img class="movie-poster" src="' + serchResult.Poster + '">';
                        }
                        returnHTML += '</div>';
                        returnHTML += '<span class="movie-title">' + serchResult.Title + '</span>';
                        returnHTML += '<span class="movie-year">' + serchResult.Year + '</span></li>';

                    });
                }
                //We add the fresh HTML to the DOM, and fade it in
                $('#movies').append(returnHTML).fadeIn(400);
                $('#movies img').click(movieDescription);
            }
        };

        //This is where we start all of the code above
        $('#movies').fadeOut(400, function() { //First we fade out the movies already showing
            $.getJSON(url, data, uiFunction); //When we are done, we start the ajax request
        });
    });
}();
