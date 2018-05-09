const express = require('express');
const mongoose = require('mongoose');

// define variables that will direct routes to proper directory
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');


const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected')) // if successful
    .catch(err => console.log(err)); // if error

app.get('/', (req, res) => res.send('Hi there world!'));

// Setting up middleware for Routes
app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}.`));