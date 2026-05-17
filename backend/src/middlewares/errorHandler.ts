import { Request, Response, NextFunction } from 'express';

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({ status: 'fail', message: "Đã bắt được lỗi" });
}

export default errorHandler;