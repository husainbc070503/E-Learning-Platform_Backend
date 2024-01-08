const ValidUser = require('../middlewares/ValidUser');
const IsStudent = require('../middlewares/isStudent');
const Enroll = require('../models/Enrollment');
const router = require('express').Router();

router.post('/enrollStudent', ValidUser, IsStudent, async (req, res) => {
    try {
        var enroll = await Enroll.create({ ...req.body, student: req.user._id });
        enroll = await Enroll.findById(enroll._id).populate('student').populate('course');
        enroll = await enroll.populate('course.category');
        res.status(200).json({ success: true, enroll });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/enrollments', ValidUser, async (req, res) => {
    try {
        var enrollments = await Enroll.find().populate('student').populate('course');
        enrollments = await Promise.all(enrollments.map(async (item) => {
            await item.course.populate('category');
            await item.course.populate('instructor')
            return item;
        }));
        res.status(200).json({ success: true, enrollments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

module.exports = router;