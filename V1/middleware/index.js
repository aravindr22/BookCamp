var Book = require("../models/book.js"),
    Comment = require("../models/comment.js"),
    Review = require("../models/review");

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

middlewareobj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Book.findById(req.params.id).populate("reviews").exec(function (err, foundBook) {
            if (err || !foundBook) {
                req.flash("error", "Book not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundBook.reviews
                var foundUserReview = foundBook.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/books/" + foundBook._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareobj.checkReviewOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("/books");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/books");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/books");
    }
}

module.exports = middlewareobj;