var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");    

//home page of the website
router.get("/", function (req, res) {
    res.render("landing");
});

//---------------------------------Auth Routes----------------------------------

//Register get route
router.get("/register", function (req, res) {
    res.render("register");
});

//Register Post Route
router.post("/register", function (req, res) {
    var newuser = new User({ username: req.body.username });
    if (req.body.admincode === "secretcode123") {
        newuser.isadmin = true;
    }
    User.register(newuser, req.body.password, function (err, data) {
        if (err) {
            console.log(err);            
            req.flash("success", err.message);
            res.redirect("/register");
            //return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + data.username);
            res.redirect("/campground");
        });
    });
});

//Login get route
router.get("/login", function (req, res) {
    res.render("login");
});

//Login post route
router.post('/login', passport.authenticate("local",
    {
        successRedirect: "/campground",
        failureRedirect: "/login"
    }), function (req, res) {        
});

//Logout Route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "You are been logged out");
    res.redirect("/campground");
}); 

//Forgot password route
router.get('/forgot', function (req, res){
    res.render("forgot");
});

router.post('/forgot', function(req, res){
    req.flash("success", "Click the link on the mail to change password");
    res.redirect("/campground")
});


module.exports = router;