const mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: "Please provide a rating between (1-5) Stars",
        default: 1,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value"
        }
    },
    text: { type: String, default: null },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);