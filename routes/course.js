const { Router } = require('express');
const { userMiddleware } = require('../middleware/userMiddleware');
const courseRouter = Router();
const { courseModel, purchaseModel } = require('../db');

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    if (!courseId) {
        return res.json(400).json({
            message: 'Please provide the courseId'
        })
    }

    try {
        const existingPurchase = await purchaseModel.findOne({
            userId,
            courseId
        })
        if (existingPurchase) {
            return res.status(400).json({
                message: "The course is already purchased"
            })
        }

        await purchaseModel.create({
            userId,
            courseId
        })

        res.status(201).json({
            message: 'You have purchased the course successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while purchasing the course',
            error: error.message
        });
    }
})

courseRouter.get('/preview', async (req, res) => {
    try {
        const courses = await courseModel.find({});
        res.status(200).json({
            courses: courses
        })
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