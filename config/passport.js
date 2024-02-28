const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done) {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                return done(null, false, { message: 'User not found.' });
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Invalid password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err, false, { message: 'Error during login.' });
        }
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done) {
        try {
            if (req.user) {
                return done(null, req.user);
            }

            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return done(null, false, { message: 'Email is already registered.' });
            }

            const newUser = new User({
                email: email,
                password: User.generateHash(password),
                name: req.body.name,
                location: req.body.location,
                role: req.body.role
            });

            const savedUser = await newUser.save();
            return done(null, savedUser);
        } catch (err) {
            return done(err, false, { message: 'Error during signup.' });
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
