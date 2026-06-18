import { Request, Response, NextFunction } from "express";
import taskValidator from "../validators/taskValidator";
import AppError from "../utils/AppError";
import taskModel from "../models/Task";
import projectModel from "../models/Project";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, project, description, status, priority, dueDate, assignedTo } = taskValidator.parse(req.body);

        const hasAccess = await projectModel.findOne({
            _id: project,
            $or: [{ owner: req.user._id }, { members: req.user._id }],
        });

        if (!hasAccess) {
            throw new AppError("Chỉ chủ sở hữu hoặc thành viên của dự án mới có thể tạo task", 403);
        }

        const newTask = await taskModel.create({
            title, project, description, status, priority, dueDate, assignedTo,
        });
        return res.status(201).json({
            status: "success",
            data: newTask,
        });
    } catch (error) {
        next(error);
    }
};

const getTasksByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const hasAccess = await projectModel.findOne({
            _id: projectId,
            $or: [{ owner: req.user._id }, { members: req.user._id }],
        });

        if (!hasAccess) {
            throw new AppError("Chỉ chủ sở hữu hoặc thành viên của dự án mới có thể tạo task", 403);
        }

        const task = await taskModel.find({project: projectId});

        return res.status(200).json({
            status: "success",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        const task = await taskModel.findById(taskId);

        if (!task) {
            throw new AppError("Task không tồn tại", 404);
        }

        const hasAccess = await projectModel.findOne({
            _id: task.project,
            $or: [{owner: req.user._id}, {members: req.user._id}],
        });

        if(!hasAccess) {
            throw new AppError("Chỉ chủ sở hữu hoặc thành viên của dự án mới có thể tạo task", 403);
        }

        const parsed = await taskValidator.partial().safeParse(req.body);
        if(!parsed.success){
            throw new AppError("Dữ liệu không hợp lệ", 400);
        }
        const { title, description, status, priority} = parsed.data;
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;

        await task.save();

        return res.status(200).json({
            status: "success",
            data: task
        });
    } catch (error) {
        next(error);
    }
}

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId;

        const task = await taskModel.findById(taskId);

        if (!task) {
            throw new AppError("Task không tồn tại", 404);
        }

        const hasAccess = await projectModel.findOne({
            _id: task.project,
            $or: [{owner: req.user._id}, {members: req.user._id}],
        });

        if(!hasAccess) {
            throw new AppError("Chỉ chủ sở hữu hoặc thành viên của dự án mới có thể tạo task", 403);
        }

        await taskModel.findByIdAndDelete(taskId);

        return res.status(200).json({
            status: "success",
            message: "Task đã được xóa thành công",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
};