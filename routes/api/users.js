const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // https://www.npmjs.com/package/jsonwebtoken
const keys = require('../../config/keys');
const passport = require('passport'); // https://www.npmjs.com/package/passport

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Users Works"
}));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // size
                r: 'pg', // rating
                d: 'mm' // default shows generic avatar icon
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by email
    User.findOne({
            email
        })
        .then(user => {
            // Check for user
            if (!user) {
                return res.status(404).json({
                    email: 'User not found'
                });
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        // Create JWT payload, this will be an object that you can include whatever
                        // you want to in the payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        // Sign/create the Token
                        // pass the payload and key(which will be stored in config/keys file)
                        // make sure to require(../../config/keys.js);
                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 7200
                        }, (err, token) => {
                            res.json({
                                success: true,
                                // the token will have to have 'Bearer in front of it because we will use it in a header
                                token: `Bearer ${token}`
                            })
                        });
                    } else {
                        return res.status(400).json({
                            password: 'Password incorrect'
                        });
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current user data
// @access  Private
// We are setting up a private route that will only display info sent when authentication has occurred
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;