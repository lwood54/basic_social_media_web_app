const JwtStrategy = require('passport-jwt').Strategy; //https://github.com/themikenicholson/passport-jwt
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

// this setup is very similar to the example use case found in the 'passport-jwt' documentation
// there were several options for authorization, we chose to use the 'fromAuthHeaderAsBearerToken()'
// which we had previously set up in the routes/api/users.js file when creating the login route
const opts = {};
// setting up options that we are passing in
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// we are basically exporting an unnamed function here. We received the passport object when this file
// is required in the server.js file. When we pass the passport object there, we can use it in this function
// that is immediately called when the file is called. -----> require('./config/passport')(passport)
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // we are able to get the payload here because we defined it in the routes/api/users.js file when
        // we were creating the token and passing it back through the header when the user is authorized
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};