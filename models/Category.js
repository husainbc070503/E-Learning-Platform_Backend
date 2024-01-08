const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

}, { timestamps: true });

const Category = mongoose.model('category', CategorySchema);
module.exports = Category;