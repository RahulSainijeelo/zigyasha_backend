import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }, // Created by a teacher
    questions: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Question"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);