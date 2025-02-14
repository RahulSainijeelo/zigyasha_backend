import { Exercise } from "../models/exercise.model.js";
import { Report } from "../models/studentReport.model.js";
import { User } from "../models/user.model.js";


// Generate a Student Report (After exercise Attempt)
export const createStudentReport = async (req, res) => {
    try {
        const { exerciseId, score, totalQuestions, correctAnswers } = req.body;
        const studentId = req.user.id;

        // Validate user is a student
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(403).json({ message: "Only students can generate reports" });
        }

        // Validate exercise exists
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        const newReport = new Report({ student: studentId, exercise: exerciseId, score, totalQuestions, correctAnswers });
        await newReport.save();

        res.status(201).json({ message: "Report generated successfully", report: newReport });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get All Reports (Only principal & Teachers)
export const getAllReports = async (req, res) => {
    try {
        if (req.user.role !== "principal" && req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const reports = await Report.find().populate("student", "name email").populate("exercise", "title subject");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get Reports for a Specific Student (Students Can See Their Own Reports)
export const getStudentReports = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Check if the student exists
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const reports = await Report.find({ student: studentId }).populate("exercise", "title subject");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Reports for a Specific exercise (Only Teachers & principal)
export const getExerciseReports = async (req, res) => {
    try {

       

       

        if (req.user.role !== "principal" && req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { exerciseId } = req.params;
        const reports = await Report.find({ exercise: exerciseId }).populate("student", "name email");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a Specific Report by id (only the Student or Admin)
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate("student", "name email").populate("exercise", "title subject");

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Only the student who owns the report or an admin can view it
        if (req.user.role !== "principal" && report.student.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};