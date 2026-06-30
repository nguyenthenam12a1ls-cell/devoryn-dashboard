import express from "express";
import validateRequest from '../middlewares/validateRequest';
import { userValidator, loginValidator } from '../validators/userValidator';
import { login, register, refresh, logout } from "../controllers/userController";
import { Protected, restrictTo } from "../middlewares/authMiddleware";


const router = express.Router();

router.post('/register', validateRequest(userValidator), register);
router.post('/login', validateRequest(loginValidator), login);
router.get("/profile", Protected, (req, res) => {
    res.json({
        status: "success",
        data: {
            user: req.user
        }
    });
});
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get("/admin-only", Protected, restrictTo("admin"), (req, res) => {
    res.json({
        status: "success",
        message: "Chỉ người dùng có vai trò admin mới có thể truy cập chức năng này."
    });
});


export default router;
