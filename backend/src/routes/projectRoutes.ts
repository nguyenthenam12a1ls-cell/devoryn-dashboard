import express from "express"
import { createProject, getAllProjects, getProjectById, updateProject , deleteProject} from "../controllers/projectController";
import { Protected } from "../middlewares/authMiddleware";

const router = express.Router();


router.post("/create", Protected, createProject)
router.get("/all", Protected, getAllProjects)
router.get("/:id", Protected, getProjectById)
router.put("/update/:id", Protected, updateProject)
router.delete("/delete/:id", Protected, deleteProject);


export default router;