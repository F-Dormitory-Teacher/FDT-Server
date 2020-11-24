import { Router } from "express";
import noticeController from "../../controllers/notice.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.get("/getNotices", noticeController.getNotices);
router.get("/getNotice/:idx", noticeController.getNotice);
router.post("/createNotice", authMiddleware.admin, noticeController.createNotice);
router.put("/modifyNotice", authMiddleware.admin, noticeController.modifyNotice);

export default router;
