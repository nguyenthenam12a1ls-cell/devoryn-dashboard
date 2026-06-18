import express from "express";
import taskController from "../controllers/taskController";
import {Protected} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", Protected,  taskController.createTask);
router.get("/project/:projectId", Protected, taskController.getTasksByProject);
router.put("/update/:taskId", Protected, taskController.updateTask);
router.delete("/delete/:taskId", Protected, taskController.deleteTask);

export default router;