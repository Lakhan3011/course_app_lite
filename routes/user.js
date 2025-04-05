const { Router } = require('express');
const { userModel } = require('../db');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
    const userSchema = z.object({
        email: z.string().email().min(5),
        password: z.string().min(5).max(15),
        firstName: z.string().min(5).max(15),
        lastName: z.string().min(5).max(15)
    })

    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return (
            res.status(400).json({
                message: "Incorrect data format",
                error: result.error
            })
        );
    }

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })
        res.status(201).json({
            message: "signup successfull"
        })
    } catch (error) {
        console.error('Error during signup', error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "User already exists",
            })
        }
        res.status(500).json({
            message: "Internal server error",
        })
    }
})

userRouter.post('/signin', async (req, res) => {
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

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(403).json({
            message: 'Incorrect credentials'
        })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        req.session.userId = user._id;

        res.status(200).json({
            message: "Signin successfull"
        })
    } else {
        res.status(400).json({
            message: "invalid credentials"
        })
    }

})

userRouter.post('/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                message: "Sign out failed"
            })
        }
        res.clearCookie('connect.sid');
        res.json({
            message: 'user sign out success'
        })
    })
})

userRouter.get('/purchases', (req, res) => {
    res.json({
        message: "user sign-up successfully"
    })
})

module.exports = {
    userRouter: userRouter
}