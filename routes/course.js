const { Router } = require('express');
const { userMiddleware } = require('../middleware/userMiddleware');
const userSessionMiddleware = require('../middleware/userSessionMiddleware');
const courseRouter = Router();
const { courseModel, purchaseModel } = require('../db');

courseRouter.post('/purchase', userSessionMiddleware, userMiddleware, async (req, res) => {
    const userId = req.userId;;
    const courseId = req.body.courseId;

    if (!courseId) {
        return res.status(400).json({
            message: 'Please provide the courseId'
        })
    }

    try {
        const existingPurchase = await purchaseModel.findOne({
            courseId: courseId,
            userId: userId
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "The course is already purchased"
            })
        }

        await purchaseModel.create({
            courseId: courseId,
            userId: userId
        });

        res.status(201).json({
            message: 'You have successfully  purchased the course '
        });
    } catch (error) {
        console.error('Purchase Error:', error);
        res.status(500).json({
            message: 'An error occurred while purchasing the course',
            error: error
        });
    }
})

courseRouter.get('/preview', async (req, res) => {
    try {
        const courses = await courseModel.find({});
        res.status(200).json({
            courses: courses
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching the courses",
            error: error.message
        });
    }
})

module.exports = {
    courseRouter: courseRouter
}