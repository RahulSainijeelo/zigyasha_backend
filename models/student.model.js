import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    schoolId: {
        type: String
    },
    level: {
        type: String,
    },
    grade: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refer: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Student = mongoose.model('Student', studentSchema);