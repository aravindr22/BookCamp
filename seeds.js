var mongoose = require("mongoose"),
    Book = require("./models/book"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Hill top",
        image: "https://images.unsplash.com/photo-1457464118253-62084ece6277?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Hill Top is a Northern Village of the Southern Highlands of New South Wales, Australia, in Wingecarribee Shire. Previous names of the village include Hilltop and Jellore. It is a 17 km drive to Mittagong and around 10 km drive to the Hume Highway via Colo Vale. It is roughly 6�8 km to Yerrinbool as the crow flies. At the 2016 census, Hill Top had a population of 2,674."
    },
    {
        name: "Forest view",
        image: "https://images.unsplash.com/photo-1502808895237-8d699559bd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Hill Top is a Northern Village of the Southern Highlands of New South Wales, Australia, in Wingecarribee Shire. Previous names of the village include Hilltop and Jellore. It is a 17 km drive to Mittagong and around 10 km drive to the Hume Highway via Colo Vale. It is roughly 6�8 km to Yerrinbool as the crow flies. At the 2016 census, Hill Top had a population of 2,674."
    },
    {
        name: "Butterfly",
        image: "https://images.unsplash.com/photo-1572259542458-e16840f7caf0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Butterfly on Yellow flowers"
    }
];

function seedDB() {

    //Remove all books
    Book.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed Book");
            Comment.deleteMany({}, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("removed comments!");
            });
            //Add new Books
            data.forEach(function (seed) {
                Book.create(seed, function (err, book) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a new book");
                        //create a comment
                        Comment.create(
                            {
                                text: "This is a best place with no connectivity with outer world",
                                author: "abcde"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    book.comments.push(comment);
                                    book.save();
                                    console.log("created comment");
                                }                                
                            });
                    }
                });
            });
        }
    });

}

module.exports = seedDB;