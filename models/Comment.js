const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lesson'
    }

}, { timestamps: true });

const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;