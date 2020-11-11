const Review = require("../models/review");
const Book = require("../models/book");
const book = require("../models/book");

const viewBalancer = require("../helpers/viewbalancer");
const reviewPopularitycalculator = require("../helpers/reviewPopularityHelper");
const reviewHelper = require("../helpers/reviewHelper");

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
            book.rating = reviewHelper.calculateAverage(book.reviews);
            //view balancer
            viewBalancer.viewBalancer(book._id);
            //popularity
            book.popularity = book.popularity + reviewPopularitycalculator.reviewPopularityCalculator(review.rating);
            //save book
            book.save();
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
            book.rating = reviewHelper.calculateAverage(book.reviews);
            //view balancer
            viewBalancer.viewBalancer(book._id);
            //save changes
            book.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/books/' + book._id);
        });
    });
}

//Review delete
exports.reviewDelete = (req, res) => {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Book.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, book) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate BOok average
            book.rating = reviewHelper.calculateAverage(book.reviews);
            //View balancer
            viewBalancer.viewBalancer(req.params.id);
            //save changes
            book.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/books/" + req.params.id);
        });
    });
}