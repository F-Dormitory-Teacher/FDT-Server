import { Router } from "express";
import noticeController from "../../controllers/notice.controller";
import uploadController from "../../controllers/upload.controller";
import uploadMiddleware from "../../middleware/upload";

const router = Router();

router.post("/", uploadMiddleware, uploadController.upload);

export default router;
