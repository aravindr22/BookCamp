var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//Comments get Route
router.get("/new", middleware.isLoggedin, function (req, res) {
    Campground.findById(req.params.id, function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("cmntsnew", { campground: foundcampground });
        }
    });
});

//comments post route
router.post("/", middleware.isLoggedin, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong");
            res.redirect("/campground");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();              
                    req.flash("success", "Comment Created Successfully");
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});

//Comment Edit route
router.get("/:comment_id/edit", middleware.checkcommentownership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {            
            res.render("cmntsedit", { campground_id: req.params.id, comment: foundcomment });
        }
    });    
});

//Comment Update Route
router.put("/:comment_id", middleware.checkcommentownership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedcomment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Edited Succesfully");            
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//Comment destroy route
router.delete("/:comment_id", middleware.checkcommentownership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, deleted, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted Succesfully");            
            res.redirect("/campground/" + req.params.id);
        }
    })
});

module.exports = router;
