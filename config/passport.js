//passport.js

// Import the required packages
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

// Import the User model
const User = require("../models/User");

// Serialize the user object into a unique identifier
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user object from the unique identifier
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Define a new local authentication strategy
passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Find a user with the given email
        User.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                // If the user is not found, return an error
                return done(null, false, { msg: "Invalid email or password." });
            }
            // Compare the password with the stored password
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    // If the password matches, return the user object
                    return done(null, user);
                }
                // If the password does not match, return an error
                return done(null, false, { msg: "Invalid email or password." });
            });
        });
    })
);

// Middleware function to check if a user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, continue processing the request
        return next();
    }
    // If the user is not authenticated, redirect to the login page
    res.redirect("/login");
};
