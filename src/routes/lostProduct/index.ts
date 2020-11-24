import { Router } from "express";
import lostProductController from "../../controllers/lostProduct.controller";
import authMiddleware from "../../middleware/auth";
import upload from "../../middleware/upload";

const router = Router();

router.post("/", authMiddleware.admin, lostProductController.createLostProduct);

export default router;
