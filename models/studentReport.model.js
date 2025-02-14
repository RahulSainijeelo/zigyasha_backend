import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId, ref: "Quiz"
    },
    exercise:{
        type: mongoose.Schema.Types.ObjectId, ref: "Exercise"
    },
    score: {
        type: Number, required: true
    },
    totalQuestions: {
        type: Number, required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date, default: Date.now
    }
});

export const Report = mongoose.model('Report', reportSchema);