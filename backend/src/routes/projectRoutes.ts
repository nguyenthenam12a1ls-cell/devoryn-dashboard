import express from "express"
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController";
import { Protected } from "../middlewares/authMiddleware";
import checkProjectAccess from "../middlewares/checkAccess";


const router = express.Router();


router.post("/create", Protected, createProject)
router.get("/all", Protected, getAllProjects)
router.get("/:id", Protected, checkProjectAccess('any'), getProjectById)
router.put("/update/:id", Protected, checkProjectAccess('owner'), updateProject)
router.delete("/delete/:id", Protected, checkProjectAccess('owner'), deleteProject);


export default router;