// config/passport.js


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var pgp = require('pg-promise')({});
var db = pgp(process.env.DATABASE_URL || {database: 'library'});
// load up the user model
// var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.userid);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {


        var query = 'SELECT * FROM users WHERE userid = $1';
        db.any(query, [id])
          .then(function() {
            return db.any(query, id);
          })
          .then(function(user) {
            done(null, user);
          })
          .catch(function(err) {
            done(err, null);
          });
    });


    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function(err, user) {
          var query = 'SELECT * FROM users WHERE userid = $1';
          db.any(query, [profile.id])
            .then(function(users) {
              if (users.length == 0) {
                var userid = profile.id;
                var name = profile.displayName;
                var email = profile.emails[0].value;

                let adduser = 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING *';
                return db.one(adduser, [userid, token, name, email])
              }

              return users[0];
            })
            .then(function (u) {
              // console.log(u);
              done(null, u);
            })
            .catch(err);


            // try to find the user based on their google id
            // User.findOne({ 'google.id' : profile.id }, function(err, user) {
            // db.findOne({ 'google.id' : profile.id }, function(err, user) {
            //     if (err)
            //         return done(err);
            //
            //     if (user) {
            //
            //         // if a user is found, log them in
            //         return done(null, user);
            //     } else {
            //         // if the user isnt in our database, create a new user
            //         var newUser          = new User();
            //
            //         // set all of the relevant information
            //         newUser.google.id    = profile.id;
            //         newUser.google.token = token;
            //         newUser.google.name  = profile.displayName;
            //         newUser.google.email = profile.emails[0].value; // pull the first email
            //
            //         // save the user
            //         newUser.save(function(err) {
            //             if (err)
            //                 throw err;
            //             return done(null, newUser);
            //         });
            //     }
            // });

        });

    }));

};
