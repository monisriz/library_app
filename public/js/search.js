$(document).ready(function () { // only begin once page has loaded
    $('#txtBookSearch').autocomplete({ // attach auto-complete functionality to textbox
        // define source of the data
        source: function (request, response) {
            // url link to google books, including text entered by user (request.term)
            var booksUrl = 'https://www.googleapis.com/books/v1/volumes?printType=books&q=' + encodeURIComponent(request.term);
            $.ajax({
                url: booksUrl,
                dataType: 'jsonp',
                success: function(data) {
                  console.log(data);
                  response($.map(data.items.slice(0,5), function (item) {
                      if (item.volumeInfo.authors && item.volumeInfo.title
                      && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate) {
                          return {
                              // label value will be shown in the suggestions
                              // label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                              label: item.volumeInfo.title + ' - ' + item.volumeInfo.authors[0],

                              // value is what gets put in the textbox once an item selected
                              value: item.volumeInfo.title,
                              // other individual values to use later
                              bookId: item.id,
                              selfLink: item.selfLink,
                              title: item.volumeInfo.title,
                              author: item.volumeInfo.authors[0],
                              isbn: item.volumeInfo.industryIdentifiers,
                              publishedDate: item.volumeInfo.publishedDate,
                              image: (item.volumeInfo.imageLinks == null ? '' : item.volumeInfo.imageLinks.thumbnail),
                              description: item.volumeInfo.description,
                              genre: item.volumeInfo.categories
                          };
                      }
                  }));
                }
            });

        },


        select: function (event, ui) {
            // what to do when an item is selected
            // first clear anything that may already be in the description
            $('#divDescription').empty();
            $('#searchHeading').css('display', 'flex');
            // we get the currently selected item using ui.item
            // show a pic if we have one
            if (ui.item.image != '') {
                $('#divDescription').append('<img src="' + ui.item.image + '" style="float: left; padding: 10px;">');
            }
            // and title, author, and year
            $('#divDescription').append('<p><b>Title:</b> ' + ui.item.title  + '</p>');
            $('#divDescription').append('<p><b>Author:</b> ' + ui.item.author  + '</p>');
            $('#divDescription').append('<p><b>First published year:</b> ' + ui.item.publishedDate  + '</p>');
            // and the usual description of the book
            $('#divDescription').append('<p><b>Description:</b> ' + ui.item.description  + '</p>');
            // and show the link to oclc (if we have an isbn number)
            if (ui.item.isbn && ui.item.isbn[0].identifier) {
              // console.log(ui.item.isbn);
              // console.log(ui.item.isbn[0].identifier);
                $('#divDescription').append('<p><b>ISBN:</b> '
                + ui.item.isbn[0].identifier + '</p>');
                // $('#divDescription').append('<a href="http://www.worldcat.org/isbn/'
                // + ui.item.isbn[0].identifier + '" target="_blank">View item on worldcat</a>');
            }
            // add book to library
            $('#addForm').attr('action', `/add/${ui.item.bookId}`);
            $('#descTitle').attr('value', ui.item.title);
            $('#descAuthor').attr('value', ui.item.author);
            $('#descYear').attr('value', ui.item.publishedDate);
            $('#descDescription').attr('value', ui.item.description);
            if (ui.item.isbn && ui.item.isbn[0].identifier) {
              $('#descIsbn').attr('value', ui.item.isbn[0].identifier);
            };
            $('#descGenre').attr('value', ui.item.genre[0]);
            if (ui.item.image != '') {
                $('#descCover').attr('value', ui.item.image);
            };
            $('#addBtn').css('display', 'flex');

        },
        minLength: 3 // set minimum length of text the user must enter
    });



});
