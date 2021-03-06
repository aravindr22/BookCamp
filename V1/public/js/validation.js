const input = document.querySelector(".password-input");
const error = document.querySelector(".error-password-message");
const minput = document.querySelector(".email-input");
const merror = document.querySelector(".error-email-message");
const reinput = document.querySelector(".retype-pass");
const reerror = document.querySelector("error-retype-message");
const timeout = null;
const Mtimeout = null;
const Rtimeout = null;

//const showError = message => {
//    error.style.color = "#C91E1E";
//    error.style.display = "block";
//    error.innerHTML = message;
//}

function showReerror(message) {
    reerror.style.color = "#ff3300";
    reerror.style.display = "block";
    reerror.innerHTML = message;
}

function showRepass(message) {
    reerror.style.color = "ff3300";
    reerror.innerHTML = message;
}

function showMError(message) {
    merror.style.color = "#ff3300";
    merror.style.display = "block";
    merror.innerHTML = message;
}

function showMPass(message) {
    merror.style.color = "#33e314";
    merror.innerHTML = message;
}

//password validation
function showError(message){
    error.style.color = "#ff3300";
    error.style.display = "block";
    error.innerHTML = message;
}

const showPass = message => {
    error.style.color = "#33e314";
    error.innerHTML = message;
}

function validateRetypePass(pass1, pass2){
    if(pass1 == pass2){
        showRepass("Retyped Password is correct");
    } else {
        showReerror("Retped Password is wrong");
    }
}

function validateMail(emailField) {    
    var x = emailField;
    var atposition = x.indexOf("@");
    var dotposition = x.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
        showMError("Enter a valid Mail address");
        //return false;
    } else {
        showMPass("Valid Mail Address");
    }
}

//const validatePassword = password => {
function validatePassword(password) {
    const lowerCaseRegex = new RegExp('^(?=.*[a-z])');
    const UpperCaseRegex = new RegExp('^(?=.*[A-Z])');
    const SpecialCharacterRegex = new RegExp('^(?=.*[!@#$%&*])');
    const NumericRegex = new RegExp('^(?=.*[0-9])');

    if (password.length < 6) {
        showError("Your Passowrd must be atleast 6 characters long");
    } else if (!lowerCaseRegex.test(password)) {
        showError("Your Password must include atleast one lowercase character");
    } else if (!UpperCaseRegex.test(password)) {
        showError("Your Password must include atleast one Uppercase character");
    } else if (!SpecialCharacterRegex.test(password)) {
        showError("Your Password must include atleast one Special character");
    } else if (!NumericRegex.test(password)) {
        showError("Your Password must include atleast one Number");
    } else {
        showPass("Strong Password");
    }
};

input.addEventListener('keyup', e => {
    const password = e.target.value;
    clearTimeout(timeout);
    timeout = setTimeout(() => validatePassword(password), 400);
});

minput.addEventListener('keyup', e => {
    const mail = e.target.value;
    clearTimeout(Mtimeout);
    Mtimeout = setTimeout(() => validateMail(mail), 400);
});

// reinput.addEventListener('keyup', e => {
//     clearTimeout(Rtimeout);
//     Rtimeout = setTimeout(() => validateRetypePass(input, reinput), 400);
// })