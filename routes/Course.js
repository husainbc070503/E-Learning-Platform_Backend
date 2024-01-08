const ValidUser = require('../middlewares/ValidUser');
const ValidateInput = require('../middlewares/ValidateInput');
const IsInstructor = require('../middlewares/isInstructor');
const IsStudent = require('../middlewares/isStudent');
const Course = require('../models/Course');
const AddCourse = require('../validators/CourseValidator');
const router = require('express').Router();

router.post('/addCourse', ValidateInput(AddCourse), ValidUser, IsInstructor, async (req, res) => {
    try {
        var course = await Course.create(req.body);
        course = await Course.findById(course._id)
            .populate('instructor')
            .populate('category');

        res.status(200).json({ success: true, course });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateCourse/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            .populate('instructor')
            .populate('category');

        res.status(200).json({ success: true, course });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteCourse/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/courses', ValidUser, async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor')
            .populate('category');

        res.status(200).json({ success: true, courses });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/course/:id', ValidUser, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateRating/:id', ValidUser, IsStudent, async (req, res) => {
    try {
        const rating = await Course.findById(req.params.id).select('rating');
        const sum = rating.rating ? rating.rating + req.body.rating : 0;
        const avgRating = sum / 2;
        const course = await Course.findByIdAndUpdate(req.params.id, { rating: avgRating !== 0 ? avgRating : req.body.rating }, { new: true })
            .populate('instructor')
            .populate('category');

        res.status(200).json({ success: true, course });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;