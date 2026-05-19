import { Request, Response } from "express";
import { userValidator, loginValidator } from "../validators/userValidator";
import AppError from "../utils/AppError";
import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = userValidator.safeParse(req.body);

    if (!user.success) {
        throw new AppError(user.error.issues[0].message, 400);
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

    // Phân rã newUser, gán password vào biến tạm _, gom các trường còn lại vào userObj
    const { password: _, ...userObj } = newUser.toObject();

    res.status(201).json({ status: 'success', data: { user: userObj } });

};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const parsed = loginValidator.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError("Người dùng không tồn tại", 401);
    }

    const hashPassword = await bcrypt.compare(password, user.password);

    if (!hashPassword) {
        throw new AppError("Mật khẩu sai , xin vui lòng nhập lại", 401);
    }

    const isMatch = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '90d' });

    // Phân rã user, bỏ password đi, gom phần còn lại vào userObj
    const { password: _, ...userObj } = user.toObject();

    res.status(200).json({
        status: 'success',
        token: isMatch,
        data: { user: userObj } // Trả về userObj đã lọc mật khẩu
    });
}

export { register, login };