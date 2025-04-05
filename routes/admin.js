const { Router } = require('express');
const { adminModel, courseModel } = require('../db')
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { adminMiddleware } = require('../middleware/adminMIddleware');

const adminRouter = Router();

adminRouter.post('/signup', async (req, res) => {
    // zod validation
    const adminSchema = z.object({
        email: z.string().email().min(5),
        password: z.string().min(5),
        firstName: z.string().min(3).max(15),
        lastName: z.string().min(5).max(15)
    })

    const result = adminSchema.safeParse(req.body);

    if (!result.success) {
        return (
            res.status(400).json({
                message: "Incorrect data format",
                error: result.error
            })
        );
    }

    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);   // hash password using bcrypt

    try {
        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        res.status(201).json({
            message: "signup successfull"
        })
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(400).json({
            message: "Admin already exists!!"
        })
    }
})

adminRouter.post('/signin', async (req, res) => {
    const schema = z.object({
        email: z.string().min(5),
        password: z.string().min(5)
    })

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid data format",
            error: result.error
        })
    }

    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
        return res.status(403).json({
            message: 'Invalid credentials'
        })
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
        req.session.adminId = admin._id;
        res.status(200).json({
            message: "sign in success"
        })
    }
    else {
        res.status(403).json({
            message: 'Invalid credentials'
        })
    }
})

adminRouter.post('/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                message: 'error in admin sign out'
            })
        }
        res.clearCookie('connect.sid');
        res.json({
            message: 'admin sign out success'
        })
    })
})

adminRouter.post('/course', adminMiddleware, async (req, res) => {
    const schema = z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        imageUrl: z.string().url(),
        price: z.number().positive()
    })

    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.json({
            message: "Incorrect data format",
            error: result.error
        })
    }

    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorId: adminId
    })


    res.status(201).json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put('/course', adminMiddleware, async (req, res) => {
    const schema = z.object({
        courseId: z.string().min(5),
        title: z.string().min(3),
        description: z.string().min(10),
        imageUrl: z.string().url(),
        price: z.number().positive()
    })

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.json({
            message: "Invalid data format",
            error: result.error
        })
    }
    const adminId = req.userId;

    const { courseId, title, description, price, imageUrl } = req.body;

    const course = await courseModel.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
        return res.status(404).json({
            message: "Course not found!!"
        })
    }

    await courseModel.updateOne(
        { _id: courseId, creatorId: adminId },
        {
            title: title || course.title,
            description: description || course.description,
            price: price || course.price,
            imageUrl: imageUrl || course.imageUrl
        }
    );

    res.status(200).json({
        message: 'Course updated..!!'
    })
})

adminRouter.delete('/course', adminMiddleware, async (req, res) => {
    const schema = z.object({
        courseId: z.string().min(5)
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.json({
            message: "Invalid data format",
            error: result.error
        })
    }

    const { courseId } = req.body;

    const course = await courseModel.findOne({ _id: courseId, creatorId: req.userId });

    if (!course) {
        return res.status(404).json({
            message: "Course not found!!"
        })
    }

    await courseModel.deleteOne({ _id: courseId, creatorId: req.userId });
    res.status(200).json({
        message: "Course deleted..!!!!"
    })
})

adminRouter.get('/course/:id', adminMiddleware, async (req, res) => {
    const courseId = req.params.id;

    const course = await courseModel.findOne({ _id: courseId, creatorId: req.userId });
    // console.log(course);

    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        })
    }

    res.status(200).json({ course });

})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    // console.log(adminId);
    const courses = await courseModel.find({ creatorId: adminId });
    // console.log(courses);
    res.status(200).json({ courses });
})


module.exports = {
    adminRouter: adminRouter
}