const Review = require("../models/review");
const Book = require("../models/book");
const middleware = require("../middleware/Index");
const book = require("../models/book");

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

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

//Reviews create
exports.reviewCreate = (req, res) => {
    //lookup book using ID
    Book.findById(req.params.id).populate("reviews").exec(function (err, book) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated book to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.book = book;
            //save review
            review.save();
            book.reviews.push(review);
            // calculate the new average review for the book
            book.rating = calculateAverage(book.reviews);
            //save book
            book.save();
            console.log(book);
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/books/' + book._id);
        });
    });
}

//review edit
exports.reviewEidt = (req, res) => {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviewEdit", {book_id: req.params.id, review: foundReview});
    });
}

//review update
exports.reviewUpdate = (req, res) => {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Book.findById(req.params.id).populate("reviews").exec(function (err, book) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate campground average
            book.rating = calculateAverage(book.reviews);
            //save changes
            book.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/books/' + book._id);
        });
    });
}