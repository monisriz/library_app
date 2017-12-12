var express = require('express');
var app = express();
require('dotenv').config();
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var body_parser = require('body-parser');
var session = require('express-session');
var pgp = require('pg-promise')({});
var db = pgp(process.env.DATABASE_URL || {database: 'library'});
var axios = require('axios');
require('./config/passport')(passport);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(body_parser.urlencoded({extended: false}));
app.set('view engine', 'hbs');
app.use('/static', express.static('public'));


//Passport stuff

// session secret
app.use(session({
  secret: 'jgdfjgldlkcjg45845jlfgj84fjg',
  resave: false,
  saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.get('/', function (request, response) {
  response.render('home.hbs');
});



app.get('/lib_main', isLoggedIn, function (request, response, next) {
  var userid = request.user[0].userid;
  let query = "SELECT * FROM books WHERE userid=$1 ORDER BY id DESC";
  db.any(query, [userid])
    .then(function(lib_items) {
      response.render('lib_main.hbs',
        {
          user: request.user,
          lib_items: lib_items,
          name: request.user[0].name,
        });
    })
    .catch(next);
});

app.get('/login', function(req, res) {

  // render the page and pass in any flash data if it exists
  res.render('login.hbs', { message: req.flash('loginMessage') });
});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.post('/add/:book_id', isLoggedIn, function (request, response, next) {
  var book_id = request.params.book_id;
  var title = request.body.descTitle;
  var author = request.body.descAuthor;
  var genre = request.body.descGenre;
  var description = request.body.descDescription;
  var pub_date = request.body.descYear;
  var isbn = request.body.descIsbn;
  var cover = request.body.descCover;
  var userid = request.user[0].userid;
  let query = "SELECT * FROM books WHERE userid=$1 AND book_id=$2";
  let update = "INSERT INTO books VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9)";
  db.any(query, [userid, book_id])
    .then(function (books){
      if(books.length > 0) {
          console.log("Book already exists in the library.")
      }
      else {
        console.log('adding');
        db.any(update, [book_id, title, author, genre, description, pub_date, isbn, cover, userid])
      }
    })
    .then(function() {
      response.redirect('/lib_main');
    })
    .catch(next);
});


app.post('/delete/:book_id', isLoggedIn, function (request, response, next) {
  var book_id = request.params.book_id;
  var userid = request.user[0].userid;

  let update = "DELETE FROM books WHERE book_id = $1 AND userid = $2";
  db.any(update, [book_id, userid])
    .then(function() {
      response.redirect('/lib_main');
    })
    .catch(next);
});



// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/lib_main',
                failureRedirect : '/login'
        }));

function isLoggedIn(request, response, next) {

    // if user is authenticated in the session, carry on
    if (request.isAuthenticated())
        return next();

    // if they aren't, redirect them to the home page
    response.redirect('/login');
}


var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
