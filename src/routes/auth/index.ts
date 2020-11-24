import { Router } from "express";
import authController from "../../controllers/auth.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.get("/", authController.certifyAuthCode);
router.post("/", authController.login);
router.post("/register", authController.register);
router.post("/auth-code", authController.sendAuthCode);
router.get("/getMyInfo", authMiddleware.loggedIn, authController.getMyInfo);

export default router;
