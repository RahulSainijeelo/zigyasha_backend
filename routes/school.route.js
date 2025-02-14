import express from "express";
import { createSchool, deleteSchool, getAllSchools, getSchoolById, updateSchool } from "../controllers/school.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

 
const router = express.Router();

router.route("/register").post(isAuthenticated ,createSchool);
router.route("/get").get(isAuthenticated ,getAllSchools);
router.route("/get/:id").get(isAuthenticated ,getSchoolById);
router.route("/update/:id").put(isAuthenticated ,updateSchool);
router.route("/:id").delete(isAuthenticated ,deleteSchool);

export default router;
