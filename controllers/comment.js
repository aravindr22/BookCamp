const Book = require("../models/book");
const Comment = require("../models/comment");
const viewBalancerHelper = require("../helpers/viewbalancer");
const updateTimeHelper = require("../helpers/updateTime");
const createTimeHelper = require("../helpers/createTime");

//Comment create form
exports.newCommentForm = function(req, res){
    Book.findById(req.params.id, function (err, foundbook) {
        if (err) {
            console.log(err);
        } else {
            res.render("cmntsnew", { book: foundbook });
        }
    });
}

//Add comment
exports.addComment = function(req, res){
    Book.findById(req.params.id, function (err, book) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong");
            res.redirect("/books");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.createdAt = createTimeHelper.createTime();
                    //save comment
                    comment.save();
                    book.popularity = book.popularity + 1;
                    book.comments.push(comment);
                    book.save();  
                    console.log(">--------------------------------------------------------Comment created");
                    console.log(comment);      
                    viewBalancerHelper.viewBalancer(req.params.id);      
                    req.flash("success", "Comment Created Successfully");
                    res.redirect("/books/" + book._id);
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
            res.render("cmntsedit", { book_id: req.params.id, comment: foundcomment });
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
            viewBalancerHelper.viewBalancer(req.params.id);
            updateTimeHelper.updateTime("comment", req.params.comment_id);
            console.log(">--------------------------------------------------------Comment Edited");
            console.log(updatedcomment);
            req.flash("success", "Comment Edited Succesfully");            
            res.redirect("/books/" + req.params.id);
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
            Book.findById(req.params.id, function(err, book){
                if(err){
                    console.log(err);
                } else {
                    book.popularity = book.popularity-0.75;
                    book.save(); 
                }
            });
            viewBalancerHelper.viewBalancer(req.params.id);
            req.flash("success", "Comment Deleted Succesfully");            
            res.redirect("/books/" + req.params.id);
        }
    })
}