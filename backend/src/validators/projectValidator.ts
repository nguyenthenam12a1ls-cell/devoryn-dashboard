import {z} from "zod";

const projectValidator = z.object({
    name: z.string().min(3, "Tên dự án không được để trống"),
    description: z.string().optional()
});

export default projectValidator;