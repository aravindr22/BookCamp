const Book = require("../models/book");

exports.updateTime = function(id){
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    Book.findById(id, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            foundBook.editedAt = ISTTime;
            foundBook.save();
        }
    })
}