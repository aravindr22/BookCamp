var passport = require("passport");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var User = require("../models/user");    
var middleware = require("../middleware/index");
var crypto = require("crypto"),
  async = require("async");

const validators = require("../helpers/validator");

//----------------------Here email address is treated as username -----------------------

//Landing page
exports.landingPage = function(req, res){
    res.render("landing");
}

//Register page
exports.registerPage = function(req, res){
    res.render("register");
}

//Register submit
exports.registerSubmit = function(req, res){
    const emailAddress = req.body.username;
    const pass = req.body.password;
    const cpass = req.body.confirmpassword;
    console.log(pass);
    console.log(cpass);

    //TO check username(email) is valid or not
    var evalid = validators.emailValidator(emailAddress);    
    var pvalid = validators.passValidator(req.body.password);
    var cemail = emailAddress.includes("gmail");
    var ccemail = emailAddress.includes("yahoo");

    if(cemail || ccemail){
      if(evalid && pvalid){
        var newuser = new User({ username: emailAddress });
        if(pass == cpass){
          if (req.body.admincode === process.env.ADMINCODE) {
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
        } else {
          req.flash("error", "Password's do not match");
          res.redirect("/register");
        }
      } else {
        req.flash("error", "Enter a Valid Email Address or a password");
        res.redirect("/register");
      }
    } else {
      req.flash("error", "Temproray or dispossal mail is not allowed");
      res.redirect("/register");
    }
    
}

//User details form
exports.getUserDetails = function(req, res){
    res.render("details");
}

//Saving the user details
exports.saveUserDetails = function(req, res){
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
    res.redirect("/books");
}

//Login page
exports.loginPage = function(req, res){
    res.render("login");
}

//CHeck login details
exports.loginVerification = passport.authenticate("local",
{
    successRedirect: "/books",
    failureRedirect: "/login",
    failureFlash: true    
}), function (req, res) {
}

//LOgut route
exports.logout = function(req, res){
    req.logout();
    req.flash("success", "You are been logged out");
    res.redirect("/books");
}

//get Forgot PAss page
exports.forgotPassword = function(req, res){
    res.render("forgot");
}

//Forgot pass post req
exports.forgotToken = function(req, res){
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
            from: "ar22testmail@gmail.com",
            to: user.username,
            subject: 'Password Reset from YelpCamp', 
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account in YelpCamp.\n\n' +
               'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
               'http://' + req.headers.host + '/reset/' + token + '\n\n' +
               'The link is valied only for 1 Hour ' +
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
          res.redirect('/books');   
        }]);
}

//Reset pass get route
exports.resetPassGet = function(req, res){
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset.ejs', {token: req.params.token});
    });
}

//Reset PassPost req
exports.resetPassPost = function(req, res){
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
        res.redirect('/books');    
    });
}