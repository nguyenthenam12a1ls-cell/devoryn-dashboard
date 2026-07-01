import { Request, Response, NextFunction } from "express";
import AppError from '../utils/AppError';
import projectModel from "../models/Project";


const checkProjectAccess = (requiredRole: 'owner' | 'any') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.params.id || req.params.projectId || req.body.project;
            if (!projectId) {
                return next(new AppError("Thiếu ID dự án", 400));
            }
            const project = await projectModel.findById(projectId);
            if (!project) {
                return next(new AppError("Dự án không tồn tại", 400));
            }
            const isOwner = project.owner.toString() === req.user._id.toString();
            const isMember = project.members.some(m => m.toString() === req.user._id.toString());

            if (requiredRole === 'owner' && !isOwner) {
                return next(new AppError("Chỉ chủ sở hữu dự án mới có quyền thực hiện hành động này", 403));
            }

            if (requiredRole === 'any' && !isOwner && !isMember) {
                return next(new AppError("Bạn không có quyền truy cập vào dự án này", 403));
            }

            req.project = project;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default checkProjectAccess;