import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";

// create a new question Only teachers Can add to a quiz
export const createQuestion = async (req, res) => {
    try {
        const { quizId, questionText, options, correctAnswer } = req.body;
        const teacherId = req.teacher.id;

        // Check if quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Only the teacher who created the quiz can add questions
        if (quiz.teacher.toString() !== teacherId) {
            return res.status(403).json({ message: "Only the quiz creator can add questions" });
        }

        const newQuestion = new Question({ quiz: quizId, questionText, options, correctAnswer });
        await newQuestion.save();

        // Add question to quiz
        quiz.questions.push(newQuestion._id);
        await quiz.save();

        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get all questions for a quiz
export const getQuestionsByQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const questions = await Question.find({ quiz: quizId });

        if (!questions.length) {
            return res.status(404).json({ message: "No questions found for this quiz" });
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

// Update a Question Only the Teacher Who Created the Quiz
export const updateQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const quiz = await Quiz.findById(question.quiz);
        if (quiz.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Only the quiz creator can update questions" });
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


// delete a question (Only the Teacher Who Created the Quiz)
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const quiz = await Quiz.findById(question.quiz);
        if (quiz.teacher.toString() !== req.teacher.id) {
            return res.status(403).json({ message: "Only the quiz creator can delete questions" });
        }

        await question.deleteOne();
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};