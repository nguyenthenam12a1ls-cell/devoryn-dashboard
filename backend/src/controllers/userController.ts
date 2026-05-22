import { Request, Response , NextFunction} from "express";
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

    const isMatch = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshMatch = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

    user.refreshToken = refreshMatch;

    await user.save();

    res.cookie("refreshToken", refreshMatch, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });


    // Phân rã user, bỏ password đi, gom phần còn lại vào userObj
    const { password: _, ...userObj } = user.toObject();

    res.status(200).json({
        status: 'success',
        token: isMatch,
        data: { user: userObj } // Trả về userObj đã lọc mật khẩu
    });
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            throw new AppError("Không tìm thấy token này", 401);
        }
        
        const isMatch = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as {id: string};
        const userId = await UserModel.findOne({ _id: isMatch.id, refreshToken: token });

        if(!userId) {
            throw new AppError("Không tìm thấy người dùng này", 403);
        }

        const newToken = jwt.sign({id: userId._id}, process.env.JWT_SECRET as string, {expiresIn: "15m"});

        res.status(200).json({
            status: "success",
            token: newToken
        });

    } catch (error) {
        next(error);
    }
};

const logout = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        if(!token) {
            throw new AppError("Không tìm thấy token này", 401);
        }

        const user = await UserModel.findOne({refreshToken: token});
    
        await user?.updateOne({refreshToken: ""});

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            status: "success",
            message: "Đăng xuất thành công"
        });


    } catch(error) {
        next(error);
    }
}

export { register, login , refresh, logout};