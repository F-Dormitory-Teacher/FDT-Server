import { Router } from "express";
import attendController from "../../controllers/attend.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.get("/getQrCode", attendController.getQrCode);
router.get("/getMyAttend", authMiddleware.user, attendController.getMyAttend);
router.get("/getAttends", authMiddleware.admin, attendController.getAttends);
router.post("/createAttend", authMiddleware.user, attendController.createAttend);
router.put("/modifyAttend", authMiddleware.admin, attendController.modifyAttend);

export default router;
