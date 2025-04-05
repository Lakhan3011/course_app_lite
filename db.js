const { Schema, default: mongoose, mongo } = require('mongoose');
const objectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String
})


const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: objectId
})

const purchaseSchema = new Schema({
    courseId: objectId,
    userId: objectId
})

const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema)
const purchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}