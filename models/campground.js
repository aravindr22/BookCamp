var mongoose = require("mongoose");

//Campground Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: "string",
    image: "String",
    price: "String",
    description: "string",
    author: {
        id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
