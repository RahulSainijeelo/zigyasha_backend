import express from "express";
import { createStudentReport, getAllReports, getQuizReports, getReportById, getStudentReports } from "../controllers/studentReport.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/create").post(isAuthenticated,createStudentReport);
router.route("/get").get(isAuthenticated ,getAllReports);
router.route("/get/student").get(isAuthenticated ,getStudentReports);
router.route("/quiz/:quizId").get(isAuthenticated , getQuizReports);
router.route("/:id").get(isAuthenticated ,getReportById);




export default router;
