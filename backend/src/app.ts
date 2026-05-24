import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler"
import AppError from './utils/AppError';
import UserRoutes from "./routes/userRoutes"
import ProjectRoutes from "./routes/projectRoutes";
dotenv.config();

const app: Application = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));
app.use('/api/user', UserRoutes);
app.use('/api/project', ProjectRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running smoothly' });
});

app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl}`, 404));
});

app.use(errorHandler);

export default app;
