const Campground = require("../models/campground");
const Comment = require("../models/comment");

exports.addCommentForm = function(req, res){
    Campground.findById(req.params.id, function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("cmntsnew", { campground: foundcampground });
        }
    });
}