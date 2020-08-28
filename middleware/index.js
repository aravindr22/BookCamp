var Book = require("../models/book.js"),
    Comment = require("../models/comment.js");

var middlewareobj = {};

middlewareobj.checkbookownership = function (req, res, next) {
        if (req.isAuthenticated()) {
            Book.findById(req.params.id, function (err, foundBook) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Book not found!!");
                    res.redirect("back");
                } else {
                    //Does user own the book?
                    if (foundBook.author.id.equals(req.user._id) || req.user.isadmin === true) {
                        next();
                    } else {
                        req.flash("error", "You Don't have Permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You Need to be Logged In");
            res.redirect("back");
        }
}

middlewareobj.checkcommentownership = function(req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function (err, foundcomment) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Comment not found!!");
                    res.redirect("back");
                } else {
                    //Does user own the comment?
                    if (foundcomment.author.id.equals(req.user._id) || req.user.isadmin === true) {
                        next();
                    } else {
                        req.flash("error", "You Don't have Permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You Need to be Logged In");
            res.redirect("back");
        }
}

middlewareobj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You Need to be Logged In");
    res.redirect("/login");
}

middlewareobj.isSignedUp = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to sign Up first");
    res.redirect("/register");
}


module.exports = middlewareobj;