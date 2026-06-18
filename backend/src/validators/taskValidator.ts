import z from "zod";
import {Status} from "../models/Task";
import {Priority} from "../models/Task";

const taskValidator = z.object({
    title: z.string().min(3, "Tiêu đề phải có ít nhất 3 kí tự"),
    project: z.string().min(1, "Dự án không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống").optional(),
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime("Ngày hết hạn không hợp lệ").optional(),
    assignedTo: z.string().optional(),
});

export default taskValidator;