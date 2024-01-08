const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    }

}, { timestamps: true });

const Lesson = mongoose.model('lesson', LessonSchema);
module.exports = Lesson;