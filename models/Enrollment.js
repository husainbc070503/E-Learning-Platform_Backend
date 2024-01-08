const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    }

}, { timestamps: true });

const Enroll = mongoose.model('enrollment', EnrollmentSchema);
module.exports = Enroll;