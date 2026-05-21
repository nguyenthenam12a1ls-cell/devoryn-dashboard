import express from "express";
import { login, register } from "../controllers/userController";
import {Protected, restrictTo} from "../middlewares/authMiddleware";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/profile", Protected, (req, res) => {
    res.json({
        status: "success", 
        data: {
            user: req.user
        }
    });
});
router.get("/admin-only", Protected, restrictTo("admin"), (req, res) => {
    res.json({
        status: "success", 
        message: "Chỉ người dùng có vai trò admin mới có thể truy cập chức năng này."
    });
});


export default router;
