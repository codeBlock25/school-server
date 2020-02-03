const mongoose = require("mongoose")
const schema = mongoose.Schema

const studentSchema = new schema({
    first_name: {
        type: String,
        lowercase: true,
        required: true
    },
    last_name: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    exams: [
        {result: {
            date: Date,
            score: Number,
            failed: Number,
            passes: Number,
            questionId: String
        }}
    ],
    test: [
        {result: {
            date: Date,
            score: Number,
            failed: Number,
            passes: Number,
            questionId: String
        }}
    ]
})

module.exports = mongoose.model("student", studentSchema)