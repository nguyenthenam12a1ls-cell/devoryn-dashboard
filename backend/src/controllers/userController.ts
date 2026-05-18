import { Request, Response } from "express";
import userValidator from "../validators/userValidator";
import AppError from "../utils/AppError";
import UserModel from "../models/User";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = userValidator.safeParse(req.body);

    if (!user.success) {
        throw new AppError(user.error.message, 400);
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new AppError('Email đã tồn tại', 400);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.create({
        name,
        email,
        password: hashPassword,
    });

    res.status(201).json({ status: 'success', data: { user: newUser } });
};

export default register;