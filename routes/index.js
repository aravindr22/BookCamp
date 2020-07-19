var express = require("express");
var router = express.Router();
var passport = require("passport");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
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
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/api/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var fromEmail = new helper.Email('aravind08222@gmail.com');
          var toEmail = new helper.Email(user.email);
          var subject = 'Password Reset from Info Globe';
          var content = new helper.Content('text/plain','You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
               'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
               'http://' + req.headers.host + '/api/reset/' + token + '\n\n' +
               'If you did not request this, please ignore this email and your password will remain unchanged.\n');
          var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            
          //Sending mail using gmail

          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          res.redirect('/api/forgot');   
        }]);
    // req.flash("success", "Click the link on the mail to change password");
    // res.redirect("/campground")
});


module.exports = router;