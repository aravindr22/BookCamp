const Review = require("../models/review");
const Book = require("../models/book");


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