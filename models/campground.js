var mongoose = require("mongoose");

//Campground Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: { type: String, default: null},
    image: "String",
    price: { type: Number, default: 0 },
    description: "string",
    popularity: { type: Number, default: 10 },
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
