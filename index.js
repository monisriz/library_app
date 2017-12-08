var express = require('express');
var app = express();
var body_parser = require('body-parser');

var pgp = require('pg-promise')({});
var db = pgp(process.env.DATABASE_URL || {database: 'library'});

app.set('view engine', 'hbs');
app.use('/static', express.static('public'));
app.use(body_parser.urlencoded({extended: false}));


app.get('/', function (request, response) {
  response.render('home.hbs');
});

app.get('/todos', function (request, response, next) {
  let query = "SELECT * FROM task ORDER BY id";
  db.any(query)
    .then(function(todolist) {
      response.render('todos.hbs', {todolist: todolist});
    })
    .catch(next);
});

app.post('/add', function (request, response, next) {
  var description = request.body.new_todo;
  var enddate = request.body.end_date;
  var priority = request.body.priority;

  let update = "INSERT INTO task VALUES(default, $1, $2, null, $3)";
  db.any(update, [description, enddate, priority])
    .then(function() {
      response.redirect('/todos');
    })
    .catch(next);
});

app.post('/update/:id', function (request, response, next) {
  var id = request.params.id;
  let query = "SELECT * FROM task WHERE id = $1";
  db.one(query, id)
    .then(function(task) {
      if (task.status) {
        var update = "UPDATE task SET status = FALSE WHERE id = $1";
      }
      else {
        var update = "UPDATE task SET status = TRUE WHERE id = $1";
      };
      return db.any(update, id);
    })
    .then(function(){
      response.redirect('/todos');
    })
    .catch(next);
});


var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
