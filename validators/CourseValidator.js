const { z } = require('zod');

const AddCourse = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(1, { message: "Name should not be empty" })
        .trim(),

    description: z
        .string({ required_error: 'Description is required' })
        .min(1, { message: "Description should not be empty" })
        .trim(),

    category: z
        .string({ required_error: 'Category is required' })
        .min(1, { message: "Category must be selected" }),

    instructor: z
        .string({ required_error: 'Instructor is required' }),

    image: z
        .string({ required_error: "Image is required" })
        .min(1, { message: "Image should not be empty" })
});

module.exports = AddCourse;