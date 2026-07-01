import UserModel from "../models/User";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (userData: any) => {
    const { name, email, password } = userData;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new AppError('Email đã tồn tại', 400);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await UserModel.create({ name, email, password: hashPassword });

    const { password: _, ...userObj } = newUser.toObject();
    return userObj;
}

const loginUser = async (loginData: any) => {
    const { email, password } = loginData;

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError("Người dùng không tồn tại", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Mật khẩu sai, xin vui lòng nhập lại", 401);
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();
    const { password: _, ...userObj } = user.toObject();
    return { user: userObj, accessToken, refreshToken };
};

export default { registerUser, loginUser };