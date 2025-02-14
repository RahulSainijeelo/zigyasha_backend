import express from "express";
import { createQuestion, deleteQuestion, getQuestionById, getQuestionsByQuiz, updateQuestion } from "../controllers/question.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createQuestion);
router.route("/quiz/:quizId").get(isAuthenticated ,getQuestionsByQuiz);
router.route("/get/:id").get(isAuthenticated ,getQuestionById);
router.route("/update/:id").put(isAuthenticated ,updateQuestion);
router.route("/:id").delete(isAuthenticated ,deleteQuestion);




export default router;
