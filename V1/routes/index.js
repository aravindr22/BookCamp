var express = require("express");
var router = express.Router();
var passport = require("passport");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var User = require("../models/user");    
var middleware = require("../middleware/Index");
var crypto = require("crypto"),
  async = require("async");

const index = require("../controllers/index");
const validators = require("../helpers/validator");


router.get("/", index.landingPage);
//---------------------------------Auth Routes----------------------------------

router.get("/register", index.registerPage);
router.post("/register", index.registerSubmit);
router.get("/userdetails",middleware.isSignedUp, index.getUserDetails);
router.post("/userdetails",middleware.isSignedUp, index.saveUserDetails);
router.get("/login", index.loginPage);
router.post('/login', index.loginVerification);
router.get('/logout', index.logout);
router.get('/forgot', index.forgotPassword);
router.post('/forgot', index.forgotToken);
router.get('/reset/:token', index.resetPassGet);
router.post('/reset/:token', index.resetPassPost);

module.exports = router;