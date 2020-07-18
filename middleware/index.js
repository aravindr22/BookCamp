var Campground = require("../models/campground"),
    Comment = require("../models/comment");


var middlewareobj = {};

middlewareobj.checkcampgroundownership = function (req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function (err, foundcampground) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Campground not found!!");
                    res.redirect("back");
                } else {
                    //Does user own the campground?
                    if (foundcampground.author.id.equals(req.user._id) || req.user.isadmin === true) {
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


module.exports = middlewareobj;