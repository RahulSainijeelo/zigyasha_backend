import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    schoolId: {
        type: String,
    },
    subject: {
        type: [String],
        required: true
    },
    grade: {
        type: [String],
        required: true
    },
    qualification: {
        education: String,
        skills: [String],
        exprience: [String],

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const Teacher = mongoose.model('Teacher', teacherSchema);