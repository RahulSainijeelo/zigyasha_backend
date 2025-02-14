import mongoose from "mongoose";
import { Exercise } from "../models/exercise.model.js";
import { Question } from "../models/question.model.js";
import { Report } from "../models/studentReport.model.js";
import { User } from "../models/user.model.js";
import {Teacher} from "../models/teacher.model.js";
import { Student } from "../models/student.model.js";

// Create a new exercise--> Only teachers can create
export const createExercise = async (req, res) => {
    try {

        
        const { title, subject } = req.body;
       
        const teacherId = req.teacher.id;

        console.log("Teacher ID:", teacherId);

        // Check if the user is a teacher
        const teacher = await Teacher.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(403).json({ message: "Only teachers can create exercises" });
        }
        

        const newExercise = new Exercise({ title, subject, teacher: teacherId });
        
        
        await newExercise.save();
        

        res.status(201).json({ message: "Exercise created successfully", exercise: newExercise });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all exercises
export const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find().populate("teacher", "name email");
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get a single exercise by id
export const getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id)
            .populate("teacher", "name email")
            .populate("questions");

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update a exercise only who have ceated quiz can update
export const updateExercise = async (req, res) => {
    try {
        const { title, subject } = req.body;
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        // Only the teacher who created the exercise can update it
        if (exercise.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to update this exercise" });
        }

        if (title) exercise.title = title;
        if (subject) exercise.subject = subject;
        await exercise.save();

        res.status(200).json({ message: "Exercise updated successfully", quiz });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// delete a exercise Only the creator can delete
export const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        // Only the teacher who created the quiz can delete it
        if (exercise.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to delete this exercise" });
        }

        await exercise.deleteOne();
        res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// add questions to a exercise
export const addQuestions = async (req, res) => {
    try {
        const { exerciseId, questionText, options, correctAnswer } = req.body;
        const exercise = await Exercise.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        // Only the teacher who created the exercise can add questions
        if (exercise.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Not authorized to add questions" });
        }

        const newQuestion = new Question({ exercise: exerciseId, questionText, options, correctAnswer });
        await newQuestion.save();

        // Add the question to the quiz
        exercise.questions.push(newQuestion._id);
        await exercise.save();

        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// do a exercise (students submit answers and get marks)
export const attemptExercise = async (req, res) => {
    try {
        
        const { exerciseId, answers } = req.body; // Answers is an array of { questionId, selectedOption }
        
        const studentId = req.student.id;

        if (!exerciseId) {
            return res.status(400).json({ message: "Exercise ID is required" });
        }

          //  Validate if quizId is a valid MongoDB ObjectId
          if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
            return res.status(400).json({ message: `Invalid exercise ID format: ${exerciseId}` });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid answers format. 'answers' must be an array." });
        }

        
        const exercise = await Exercise.findById(exerciseId).populate("questions");
        
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        if (!exercise.questions || exercise.questions.length === 0) {
            return res.status(400).json({ message: "Exercise has no questions" });
        }

        // Ensure the user is a student
        const student = await Student.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(403).json({ message: "Only students can attempt exercises" });
        }

        let score = 0;
        let correctAnswers = 0;

        exercise.questions.forEach((question) => {
            const studentAnswer = answers.find(ans => ans.questionId === question._id.toString());

            
            if (studentAnswer && studentAnswer.selectedOption === question.correctAnswer) {
                score += 1;
                correctAnswers += 1;
            }
        });

        const report = new Report({
            student: studentId,
            exercise: exerciseId,
            score,
            totalQuestions: exercise.questions.length,
            correctAnswers,
        });

        await report.save();

        res.status(200).json({ message: "Exercise attempted successfully", score, totalQuestions: exercise.questions.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};