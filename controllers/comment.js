const Campground = require("../models/campground");
const Comment = require("../models/comment");

//Comment create form
exports.newCommentForm = function(req, res){
    Campground.findById(req.params.id, function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("cmntsnew", { campground: foundcampground });
        }
    });
}

//Add comment
exports.addComment = function(req, res){
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
                    
                    campground.popularity = campground.popularity + 2;
                    campground.comments.push(comment);
                    campground.save();              
                    req.flash("success", "Comment Created Successfully");
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
}

//Edit Comment
exports.editComment = function(req, res){
    Comment.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {            
            res.render("cmntsedit", { campground_id: req.params.id, comment: foundcomment });
        }
    });
}

//update edited comment
exports.updateComment = function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedcomment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Edited Succesfully");            
            res.redirect("/campground/" + req.params.id);
        }
    });
}

//Delete Comment
exports.deleteComment = function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err, deleted, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted Succesfully");            
            res.redirect("/campground/" + req.params.id);
        }
    })
}