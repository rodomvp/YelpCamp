var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


router.get("/", function(req, res) {
    res.render("landing")
})
//==============
// AUTH ROUTES
//==============
router.get('/register', function(req, res) {
    res.render("register")
});

router.post('/register', function(req, res) {
    console.log(req.headers)
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(e, user) {
        if (e) {
            req.flash("error", e.message)
            return res.render("register", {error: e.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
//==============
// LOGIN ROUTES
//==============
router.get('/login', function(req, res) {
    res.render('login', {message: req.flash("error")});
});
router.post('/login', passport.authenticate("local", {
    successRedirect: '/campgrounds',
    failureRedirect: 'login'
}), function(req, res) {

});
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router