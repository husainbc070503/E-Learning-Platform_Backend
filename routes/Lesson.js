const ValidUser = require('../middlewares/ValidUser');
const ValidateInput = require('../middlewares/ValidateInput');
const IsInstructor = require('../middlewares/isInstructor');
const Lesson = require('../models/Lesson');
const AddLesson = require('../validators/LessonValidator');
const router = require('express').Router();

router.post('/addLesson', ValidUser, IsInstructor, ValidateInput(AddLesson), async (req, res) => {
    try {
        var lesson = await Lesson.create(req.body);
        lesson = await Lesson.findById(lesson._id).populate('course');
        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateLesson/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('course');
        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteLesson/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/lessons/:id', ValidUser, async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.id }).populate('course');
        res.status(200).json({ success: true, lessons });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/lessons', ValidUser, async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('course');
        res.status(200).json({ success: true, lessons });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/lesson/:id', ValidUser, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        res.status(200).json({ success: true, lesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;