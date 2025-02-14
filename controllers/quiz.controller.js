import mongoose from "mongoose";
import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Report } from "../models/studentReport.model.js";
import { User } from "../models/user.model.js";
import {Teacher} from "../models/teacher.model.js";
import {Student} from "../models/student.model.js";
// Create a new quiz--> Only teachers can create
export const createQuiz = async (req, res) => {
    try {

        
        const { title, subject } = req.body;
       
        const teacherId = req.teacher.id;

        console.log("Teacher ID:", teacherId);

        // Check if the user is a teacher
        const teacher = await Teacher.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(403).json({ message: "Only teachers can create quizzes" });
        }
        

        const newQuiz = new Quiz({ title, subject, teacher: teacherId });
        
        
        await newQuiz.save();
        

        res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all quiezes
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("teacher", "name email");
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get a single quiz by id
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate("teacher", "name email")
            .populate("questions");

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update a quiz only who have ceated quiz can update
export const updateQuiz = async (req, res) => {
    try {
        const { title, subject } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Only the teacher who created the quiz can update it
        if (quiz.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to update this quiz" });
        }

        if (title) quiz.title = title;
        if (subject) quiz.subject = subject;
        await quiz.save();

        res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// delete a quiz Only the creator can delete
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Only the teacher who created the quiz can delete it
        if (quiz.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to delete this quiz" });
        }

        await quiz.deleteOne();
        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// add questions to a quiz
export const addQuestions = async (req, res) => {
    try {
        const { quizId, questionText, options, correctAnswer } = req.body;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Only the teacher who created the quiz can add questions
        if (quiz.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to add questions" });
        }

        const newQuestion = new Question({ quiz: quizId, questionText, options, correctAnswer });
        await newQuestion.save();

        // Add the question to the quiz
        quiz.questions.push(newQuestion._id);
        await quiz.save();

        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// do a quiz (students submit answers and get marks)
export const attemptQuiz = async (req, res) => {
    try {
        
        const { quizId, answers } = req.body; // Answers is an array of { questionId, selectedOption }
        
        const studentId = req.student.id;

        if (!quizId) {
            return res.status(400).json({ message: "Quiz ID is required" });
        }

          //  Validate if quizId is a valid MongoDB ObjectId
          if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: `Invalid quiz ID format: ${quizId}` });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid answers format. 'answers' must be an array." });
        }

        
        const quiz = await Quiz.findById(quizId).populate("questions");
        
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!quiz.questions || quiz.questions.length === 0) {
            return res.status(400).json({ message: "Quiz has no questions" });
        }

        // Ensure the user is a student
        const student = await Student.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(403).json({ message: "Only students can attempt quizzes" });
        }

        let score = 0;
        let correctAnswers = 0;

        quiz.questions.forEach((question) => {
            const studentAnswer = answers.find(ans => ans.questionId === question._id.toString());

            
            if (studentAnswer && studentAnswer.selectedOption === question.correctAnswer) {
                score += 1;
                correctAnswers += 1;
            }
        });

        const report = new Report({
            student: studentId,
            quiz: quizId,
            score,
            totalQuestions: quiz.questions.length,
            correctAnswers,
        });

        await report.save();

        res.status(200).json({ message: "Quiz attempted successfully", score, totalQuestions: quiz.questions.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};