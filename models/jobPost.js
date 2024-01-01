const mongoose = require('mongoose')

const jobPostSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    remote: {
        type: String, enum: ['Remote', 'Office'],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    recruiterName: { type: String },
    createdAt: { type: Date, default: Date.now },
    companyName: {
        type: String,
        required: true
    },
    logoURL: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Intern'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('JobPost', jobPostSchema);