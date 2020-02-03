const mongoose = require("mongoose")
const schema = mongoose.Schema


const questionSchema = new schema({
    teacher_name: {
        type: String,
        required: true,
        lowercase: true
    },
    question_type: {
        type: String,
        required: true,
        lowercase: true
    },
    questions:[],
    class: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("questions", questionSchema)