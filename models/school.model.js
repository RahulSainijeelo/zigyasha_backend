import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number

    },
    level: {
        type: String,
    },
    principal: {
        type: String,
    },
    schoolId: {
        type: String,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // School Admin
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const School = mongoose.model('School', schoolSchema);