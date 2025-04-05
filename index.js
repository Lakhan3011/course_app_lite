const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { adminRouter } = require('./routes/admin');
const { courseRouter } = require('./routes/course');
require('dotenv').config();

const userSessionMiddleware = require('./middleware/userSessionMiddleware');
const adminSessionMIddleare = require('./middleware/adminSessionMiddleware');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userSessionMiddleware, userRouter);
app.use('/api/v1/admin', adminSessionMIddleare, adminRouter);
app.use('/api/v1/course', courseRouter);


const PORT = 3000;
async function main() {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB is connected'))

    app.listen(PORT, () => {
        console.log(`server is listening on ${PORT}`)
    })
}

main();

