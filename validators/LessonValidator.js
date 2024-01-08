const { z } = require('zod');

const AddLesson = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, { message: "Title should not be empty" })
        .trim(),

    description: z
        .string({ required_error: 'Description is required' })
        .min(1, { message: "Title should not be empty" })
        .trim(),

    content: z
        .string({ required_error: 'Content/Video is required' })
        .min(1, { message: "Title should not be empty" }),

    course: z
        .string({ required_error: 'Course is required' })
});

module.exports = AddLesson;