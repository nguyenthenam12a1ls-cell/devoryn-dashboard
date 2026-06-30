import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import UserModel from "../models/User";
import AppError from "../utils/AppError";
import user from "../types/express";


export const Protected = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;
        let authority = req.headers.authorization;

        if (authority && authority.startsWith("Bearer")) {
            token = authority.split(" ")[1];
        }

        if (!token) {
            throw new AppError("Bạn chưa đăng nhập! Xin vui lòng đăng nhập.", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string
        };

        const currentUser = await UserModel.findById(decoded.id);
        if (!currentUser) {
            throw new AppError("Người dùng này không tồn tại.", 401);
        }

        req.user = currentUser;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401));
        }
        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Token không hợp lệ hoặc đã bị thay đổi.", 401));
        }
        next(error);
    }
}

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req.user đã được gán bởi middleware 'protect' trước đó
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError("Bạn không có quyền truy cập chức năng này.", 403));
        }
        next();
    };
};