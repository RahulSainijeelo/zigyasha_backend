import { Quiz } from "../models/quiz.model.js";
import { Report } from "../models/studentReport.model.js";
import { User } from "../models/user.model.js";
import {Student} from "../models/student.model.js";
import {Teacher} from "../models/teacher.model.js";
import {School} from "../models/school.model.js";


// Generate a Student Report (After Quiz Attempt)
export const createStudentReport = async (req, res) => {
    try {
        const { quizId, score, totalQuestions, correctAnswers } = req.body;
        const studentId = req.student.id;

        // Validate user is a student
        const student = await Student.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(403).json({ message: "Only students can generate reports" });
        }

        // Validate quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const newReport = new Report({ student: studentId, quiz: quizId, score, totalQuestions, correctAnswers });
        await newReport.save();

        res.status(201).json({ message: "Report generated successfully", report: newReport });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get All Reports (Only school & Teachers)
export const getAllReports = async (req, res) => {
    try {
        if (req.school.role !== "school" && req.teacher.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const reports = await Report.find().populate("student", "name email").populate("quiz", "title subject");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get Reports for a Specific Student (Students Can See Their Own Reports)
export const getStudentReports = async (req, res) => {
    try {
        const studentId = req.student.id;

        // Check if the student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const reports = await Report.find({ student: studentId }).populate("quiz", "title subject");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Reports for a Specific Quiz (Only Teachers & principal)
export const getQuizReports = async (req, res) => {
    try {

       

       

        if (req.school.role !== "school" && req.teacher.role !== "teacher") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { quizId } = req.params;
        const reports = await Report.find({ quiz: quizId }).populate("student", "name email");
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a Specific Report by id (only the Student or Admin)
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate("student", "name email").populate("quiz", "title subject");

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Only the student who owns the report or an admin can view it
        if (req.school.role !== "school" && report.student.toString() !== req.student.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};