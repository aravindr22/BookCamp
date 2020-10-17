const Book = require("../models/book");

exports.viewBalancer = function(bookid){
    Book.findById(bookid, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            foundBook.views = foundBook.views - 1;
            foundBook.popularity = foundBook.popularity - 0.05;
            foundBook.save();
            console.log(foundBook);
        }
    });
}