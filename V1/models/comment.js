var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: { type: String, default: null },
    createdAt: { type: Date, default: null},
    editedAt: { type: Date, default: null },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);