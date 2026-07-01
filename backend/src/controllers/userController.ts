import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/userService";

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userObj = await userService.registerUser(req.body);

        res.status(201).json({ status: 'success', data: { user: userObj } });
    } catch (error) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, accessToken, refreshToken } = await userService.loginUser(req.body);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        res.status(200).json({ status: 'success', token: accessToken, data: { user } });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            throw new AppError("Không tìm thấy token này", 401);
        }

        const isMatch = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
        const userId = await UserModel.findOne({ _id: isMatch.id, refreshToken: token });

        if (!userId) {
            throw new AppError("Không tìm thấy người dùng này", 403);
        }

        const newToken = jwt.sign({ id: userId._id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });

        res.status(200).json({
            status: "success",
            token: newToken
        });

    } catch (error) {
        next(error);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new AppError("Không tìm thấy token này", 401);
        }

        const user = await UserModel.findOne({ refreshToken: token });

        await user?.updateOne({ refreshToken: "" });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            status: "success",
            message: "Đăng xuất thành công"
        });


    } catch (error) {
        next(error);
    }
}

export { register, login, refresh, logout };