import express from "express";
import { addQuestions, attemptQuiz, createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz } from "../controllers/quiz.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createQuiz);
router.route("/get").get(isAuthenticated ,getAllQuizzes);
router.route("/get/:id").get(isAuthenticated ,getQuizById);
router.route("/update/:id").put(isAuthenticated ,updateQuiz);
router.route("/:id").delete(isAuthenticated ,deleteQuiz);
router.route("/add-question").post(isAuthenticated ,addQuestions);
router.route("/attempt").post(isAuthenticated ,attemptQuiz);


export default router;
