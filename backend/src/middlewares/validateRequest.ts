import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import AppError from '../utils/AppError';

// Hàm này nhận vào 1 Zod Schema và trả về 1 Middleware
const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Ép Zod kiểm tra dữ liệu từ Frontend
            schema.parse(req.body);
            next(); // Nếu ổn thì cho đi tiếp vào Controller
        } catch (error) {
            if (error instanceof ZodError) {
                // Rút trích câu báo lỗi đầu tiên của Zod
                const message = error.issues.map(err => err.message).join(', ');
                next(new AppError(message, 400));
            } else {
                next(error);
            }
        }
    };
};

export default validateRequest;
