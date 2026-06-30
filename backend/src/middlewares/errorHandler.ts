import { Request, Response, NextFunction } from 'express';
import AppError from "../utils/AppError";
const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`${field} này đã tồn tại. Vui lòng sử dụng giá trị khác!`, 400);
    }

    if (error.name === 'CastError') {
        error = new AppError(`Dữ liệu ID không hợp lệ: ${err.value}`, 400);
    }

    if (error.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val: any) => val.message);
        error = new AppError(`Dữ liệu không hợp lệ: ${messages.join('. ')}`, 400);
    }

    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';

    res.status(statusCode).json({
        status: status,
        message: error.message || "Đã xảy ra lỗi hệ thống",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;