const ValidUser = require('../middlewares/ValidUser');
const IsStudent = require('../middlewares/isStudent');
const Comment = require('../models/Comment');
const router = require('express').Router();

router.post('/postComment', ValidUser, IsStudent, async (req, res) => {
    try {
        var comment = await Comment.create({ ...req.body, user: req.user._id });
        comment = await Comment.findById(comment._id)
            .populate('user')
            .populate('lesson');

        res.status(200).json({ success: true, comment });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/comments', ValidUser, async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('user')
            .populate('lesson');

        res.status(200).json({ success: true, comments });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteComment/:id', ValidUser, IsStudent, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;