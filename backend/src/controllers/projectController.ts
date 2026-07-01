import { Request, Response, NextFunction } from "express";
import projectValidator from "../validators/projectValidator";
import AppError from "../utils/AppError";
import projectModel from "../models/Project";
import taskModel from "../models/Task";



const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = projectValidator.parse(req.body);

        const newProject = await projectModel.create({
            name, description, owner: req.user._id
        });
        return res.status(201).json({
            status: "success",
            data: {
                project: {
                    name: newProject.name,
                    description: newProject.description
                },
            }
        });
    } catch (error) {
        next(error);
    }
}

const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectModel.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] })
            .populate('owner', 'name email')
            .populate('members', 'name email');
        return res.status(200).json({ data: project, status: "success" });
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ data: req.project, status: "success" });
    } catch (error) {
        next(error);
    }
}


const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = projectValidator.parse(req.body);

        const project = req.project;

        project.name = name || project.name;
        project.description = description || project.description;

        await project.save();

        return res.status(200).json({ data: project, status: "success" });
    } catch (error) {
        next(error);
    }
}

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = req.project;

        await taskModel.deleteMany({ project: project._id });

        await project.deleteOne();

        return res.status(204).json({ status: "success", data: null });
    } catch (error) {
        next(error);
    }
}

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
