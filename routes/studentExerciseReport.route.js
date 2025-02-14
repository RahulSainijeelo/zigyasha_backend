import express from "express";
import { createStudentReport, getAllReports, getExerciseReports, getReportById, getStudentReports } from "../controllers/studentExerciseReport.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createStudentReport);
router.route("/get").get(isAuthenticated ,getAllReports);
router.route("/get/student").get(isAuthenticated ,getStudentReports);
router.route("/exercise/:exerciseId").get(isAuthenticated , getExerciseReports);
router.route("/:id").get(isAuthenticated ,getReportById);




export default router;
