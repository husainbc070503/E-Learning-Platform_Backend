const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    image: { type: String },

    rating: { type: Number }

}, { timestamps: true });

const Course = mongoose.model('course', CourseSchema);
module.exports = Course;