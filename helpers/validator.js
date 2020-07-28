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

validatorobj.passValidator = function(password) {
  const lowerCaseRegex = new RegExp('^(?=.*[a-z])');
  const UpperCaseRegex = new RegExp('^(?=.*[A-Z])');
  const SpecialCharacterRegex = new RegExp('^(?=.*[!@#$%&*])');
  const NumericRegex = new RegExp('^(?=.*[0-9])');

  if (password.length < 6) {
      return false;
  } else if (!lowerCaseRegex.test(password)) {
      return false;
  } else if (!UpperCaseRegex.test(password)) {
      return false;
  } else if (!SpecialCharacterRegex.test(password)) {
      return false;
  } else if (!NumericRegex.test(password)) {
      return false;
  } else {
      return true;
  }
}

module.exports = validatorobj;