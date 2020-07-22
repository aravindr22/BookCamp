var mongoose = require("mongoose"),
    passportlocalmongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isadmin: { type: Boolean, default: false },
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    contact: { type: String, default: null },
    dob: { type: String, default: null},
    resetPasswordToken: String,
    resetPasswordExpires: { type: Date, default: null}
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", userSchema);