const ValidUser = require('../middlewares/ValidUser');
const IsInstructor = require('../middlewares/isInstructor');
const Category = require('../models/Category');
const router = require('express').Router();

router.post('/addCategory', ValidUser, IsInstructor, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ success: false, message: "Please enter category name" })

        var cat = await Category.create({ name, instructor: req.user._id });
        cat = await Category.findById(cat._id).populate('instructor')
        res.status(200).json({ success: true, cat });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateCategory/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('instructor');
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteCategory/:id', ValidUser, IsInstructor, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/categories', ValidUser, async (req, res) => {
    try {
        const cats = await Category.find().populate('instructor');
        res.status(200).json({ success: true, cats });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

module.exports = router;