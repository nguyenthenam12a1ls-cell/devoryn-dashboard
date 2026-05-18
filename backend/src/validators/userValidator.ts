import { z } from 'zod';

const userValidator = z.object({
    name: z.string().min(2, "Tên phải có ít nhất hai kí tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải từ 6 kí tự đổ lên"),
});

export default userValidator;