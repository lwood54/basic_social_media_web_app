const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// define variables that will direct routes to proper directory
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');


const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected')) // if successful
    .catch(err => console.log(err)); // if error

// Make sure to require('passport')
// Passport middleware
// https://www.npmjs.com/package/passport
app.use(passport.initialize());

// Passport Config (JWT Strategy) === you can also use passport google oauth and other options
// because 'done' or 'next' wasn't used, it should automatically go down the file
// then carry out this function, which is called when we require what is being exported from
// the config/passport.js file, then we are passing the passport object to that function.
require('./config/passport')(passport);

// Setting up middleware for Routes
// will I bet setting up '/ to catch React route?
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}.`));