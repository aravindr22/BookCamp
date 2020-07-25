var validatorobj = {};

validatorobj.emailValidator = function(emailAddress){
    var email = emailAddress;
    var atposition = email.indexOf("@");
    var dotposition = email.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length) {
      return false;
    } else {
      return true;
    }
}

module.exports = validatorobj;