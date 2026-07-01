import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any; // bất kì dữ liệu dạng nào 
            project?: any;
        }
    }
}