import { Router } from "express";
import authController from "../../controllers/auth.controller";

const router = Router();

router.get("/", authController.certifyAuthCode);
router.post("/", authController.login);
router.post("/register", authController.register);
router.post("/auth-code", authController.sendAuthCode);

export default router;
