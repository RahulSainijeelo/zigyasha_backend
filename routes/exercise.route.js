import express from "express";
import { addQuestions, attemptExercise, createExercise, deleteExercise, getAllExercises, getExerciseById, updateExercise } from "../controllers/exercise.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createExercise);
router.route("/get").get(isAuthenticated ,getAllExercises);
router.route("/get/:id").get(isAuthenticated ,getExerciseById);
router.route("/update/:id").put(isAuthenticated ,updateExercise);
router.route("/:id").delete(isAuthenticated ,deleteExercise);
router.route("/add-question").post(isAuthenticated ,addQuestions);
router.route("/attempt").post(isAuthenticated ,attemptExercise);


export default router;
