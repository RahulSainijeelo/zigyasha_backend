import express from "express";
import { createQuestion, deleteQuestion, getQuestionById, getQuestionsByExercise, updateQuestion } from "../controllers/exerciseQuestion.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createQuestion);
router.route("/exercise/:exerciseId").get(isAuthenticated ,getQuestionsByExercise);
router.route("/get/:id").get(isAuthenticated ,getQuestionById);
router.route("/update/:id").put(isAuthenticated ,updateQuestion);
router.route("/:id").delete(isAuthenticated ,deleteQuestion);




export default router;
