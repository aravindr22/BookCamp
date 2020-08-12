const Book = require("../models/book");
const comment = require("../models/comment")

exports.updateTime = function(model, id){
    var date = new Date();
    //Adjusting time accoeding to IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    if(model == "book"){
        Book.findById(id, function(err, foundBook){
            if(err){
                console.log(err);
            } else {
                foundBook.editedAt = date;
                console.log(">--------------------------------------------------------Added Updated Time to Book");
                //console.log(foundBook);
                foundBook.save();
            }
        });
    } 
    else if(model == "comment"){
        Comment.findById(id, function(err, foundcomment){
            if(err){
                console.log(err);
            } else {
                foundcomment.editedAt = date;
                console.log(">--------------------------------------------------------Added Updated Time to Book");
                foundcomment.save();
            }
        });
    }
}