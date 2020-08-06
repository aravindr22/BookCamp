var mongoose = require("mongoose");

//Campground Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: { type: String, default: null},
    image: { type: String, default: null },
    price: { type: Number, default: 0 },
    description: { type: String, default: null },
    popularity: { type: Number, default: 10 },
    views: { type: Number, default: 0},
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
