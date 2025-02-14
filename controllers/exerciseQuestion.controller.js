import { Exercise } from "../models/exercise.model.js";
import { Question } from "../models/question.model.js";

// create a new question Only teachers Can add to a exercise
export const createQuestion = async (req, res) => {
    try {
        const { exerciseId, questionText, options, correctAnswer } = req.body;
        const teacherId = req.user.id;

        // Check if exercise exists
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        // Only the teacher who created the exercise can add questions
        if (exercise.teacher.toString() !== teacherId) {
            return res.status(403).json({ message: "Only the exercise creator can add questions" });
        }

        const newQuestion = new Question({ exercise: exerciseId, questionText, options, correctAnswer });
        await newQuestion.save();

        // Add question to exercise
        exercise.questions.push(newQuestion._id);
        await exercise.save();

        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all questions for a exercise
export const getQuestionsByExercise = async (req, res) => {
    try {
        const exerciseId = req.params.exerciseId;
        const questions = await Question.find({ exercise: exerciseId });

        if (!questions.length) {
            return res.status(404).json({ message: "No questions found for this exercise" });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get a Single question by id
export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a Question Only the Teacher Who Created the Exercise
export const updateQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const exercise = await Exercise.findById(question.exercise);
        if (exercise.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the exercise creator can update questions" });
        }

        if (questionText) question.questionText = questionText;
        if (options) question.options = options;
        if (correctAnswer) question.correctAnswer = correctAnswer;
        
        await question.save();
        res.status(200).json({ message: "Question updated successfully", question });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// delete a question (Only the Teacher Who Created the Exercise)
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const exercise = await Exercise.findById(question.exercise);
        if (exercise.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the exercise creator can delete questions" });
        }

        await question.deleteOne();
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};