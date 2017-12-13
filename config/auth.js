// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    // 'facebookAuth' : {
    //     'clientID'      : 'your-secret-clientID-here', // your App ID
    //     'clientSecret'  : 'your-client-secret-here', // your App Secret
    //     'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    // },
    //
    // 'twitterAuth' : {
    //     'consumerKey'       : 'your-consumer-key-here',
    //     'consumerSecret'    : 'your-client-secret-here',
    //     'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    // },

    'googleAuth' : {
        'clientID'      : '991666356404-iqk2feg591fig7p6qnr7l8iphvtdc5r5.apps.googleusercontent.com',
        'clientSecret'  : 'FrH0a1uEcbZm3b4s_4qO9yBD',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    }

};
