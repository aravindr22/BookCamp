const Book = require("../models/book");

exports.updateTime = function(id){
    var date = new Date();
    //Adjusting time accoeding to IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    Book.findById(id, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            foundBook.editedAt = date;
            console.log(foundBook);
            foundBook.save();
        }
    })
}