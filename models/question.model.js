import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId, ref: "Quiz"
    },
    exercise:{
        type: mongoose.Schema.Types.ObjectId, ref: "Exercise"
    },
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }], // Multiple choices
    correctAnswer: {
        type: String,
        required: true
    },
});

export const Question = mongoose.model('Question', questionSchema);