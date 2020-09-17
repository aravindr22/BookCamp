const Review = require("../models/review");
const Book = require("../models/book");
const middleware = require("../middleware/Index")

//Review Index
exports.reviewIndex = (req, res) => {
    Book.findById(req.params.id).populate({
        path: "reviews",
        options: { sort: { createdAt: -1 }}
    }).exec( function(err, book){
        if(err || !book){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviewsIndex", { book: book});
    });
}

// Reviews New
exports.reviewNew = (req, res) => {
    // middleware.checkReviewExistence checks if a user already reviewed the book, only one review per user is allowed
    Book.findById(req.params.id, function (err, book) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviewsNew", {book: book});

    });
}