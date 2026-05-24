import { Request, Response, NextFunction} from "express";
import projectValidator from "../validators/projectValidator";
import AppError from "../utils/AppError";
import projectModel from "../models/Project";


const createProject = async(req: Request,res: Response,next: NextFunction) => {
    try {
        const {name, description} = projectValidator.parse(req.body);

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
    } catch(error) {
        next(error);
    }
}

const getAllProjects = async(req: Request,res: Response,next: NextFunction) => {
    try {
        const project = await projectModel.find({$or: [{owner: req.user._id}, {members: req.user._id}]});
        return res.status(200).json({data: project, status: "success"});
    } catch(error){
        next(error);
    }
};

const getProjectById = async(req: Request,res: Response,next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const project = await projectModel.findById(projectId);
        if(!project){
            throw new AppError("Dự án không tồn tại", 404);
        }

        if(project.owner.toString() === req.user._id.toString() || project.members.some(member => member.toString() === req.user._id.toString())) {
            return res.status(200).json({data: project, status: "success"});
        } else {
            throw new AppError("Bạn không có quyền truy cập", 403);
        }
    } catch(error){
        next(error);
    }
}


const updateProject = async(req: Request,res: Response,next: NextFunction) => { 
    try {
        const projectId = req.params.id;
        const {name, description} = projectValidator.parse(req.body);

        const project = await projectModel.findById(projectId);
        if(!project) {
            throw new AppError("Dự án không tồn tại", 404);
        }

        if(project.owner.toString() === req.user._id.toString()) {
            project.name = name || project.name;
            project.description = description || project.description;
            await project.save();
            return res.status(200).json({data: project, status: "success"});
        } else {
            throw new AppError("Bạn không có quyền cập nhật", 403);
        }
    } catch(error) {
        next(error);
    }
}

const deleteProject = async(req: Request,res: Response,next: NextFunction) => {
    try {
        const projectId = req.params.id;

        const project = await projectModel.findById(projectId);
        if(!project) {
            throw new AppError("Dự án không tồn tại", 404);
        }
        if(project.owner.toString() === req.user._id.toString()) {
            await project.deleteOne();
            return res.status(204).json({status: "success", data: null});
        } else { 
            throw new AppError("Bạn không có quyền xóa", 403);
        }
    } catch(error) {
        next(error);
    }
}

export {createProject, getAllProjects, getProjectById, updateProject, deleteProject};
