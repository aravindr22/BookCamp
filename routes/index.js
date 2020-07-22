var express = require("express");
var router = express.Router();
var passport = require("passport");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var User = require("../models/user");    
var crypto = require("crypto"),
  async = require("async");

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
            res.redirect("/userdetails");
        });
    });
});

//USer details route
router.get("/userdetails", function(req ,res){
  res.render("details.ejs");
});

router.post("/userdetails", function(req, res){
  console.log(req.body);
  User.findOne({ username: req.body.username }, function(err, user){
    if(err){
      console.log(err);
      User.remove({ username: req.bod.username }, function(err ,data){
        if(err){
          console.log(err);
        } else {
          console.log(data)
          res.redirect("/register");
        }
      });      
    } else {
      
      user.dob = req.body.dob;
      user.contact = req.body.contact;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      console.log(user);
      user.save();
    }
  });
  req.flash("success", "Your Details has been Succesully saved");
  res.redirect("/campground");
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
          User.findOne({ username: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          const mailOptions = {
            from: "aravind08222@gmail.com",
            to: user.username,
            subject: 'Password Reset from YelpCamp', 
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account in YelpCamp.\n\n' +
               'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
               'http://' + req.headers.host + '/reset/' + token + '\n\n' +
               'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAILUSERNAME,
                pass: process.env.GMAILPASS
            }
         });

          //Sending mail using gmail
          transporter.sendMail(mailOptions, function (err, info) {
            if(err)
                console.log(err)
            else
                console.log(info);
          });

          req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          res.redirect('/campground');   
        }]);
});

//Reset Password Route

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        user.setPassword(req.body.password, function(err) {
           user.resetPasswordToken = undefined;
           user.resetPasswordExpires = undefined;

           user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      });
     },
  ], function(err) {
    req.flash('success','Password is succesfully changed');
    res.redirect('/campground');    
  });
});


module.exports = router;