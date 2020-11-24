import { Router } from "express";
import lostProductController from "../../controllers/lostProduct.controller";
import authMiddleware from "../../middleware/auth";
import lostProductMiddleware from "../../middleware/lostProduct";

const router = Router();

router.get("/getLostInfo/:idx", lostProductController.getLostProduct);
router.get("/", lostProductController.getLostProducts);
router.post("/", authMiddleware.user, lostProductController.createLostProduct);
router.patch("/", authMiddleware.admin, lostProductMiddleware.isMine, lostProductController.updateLostProduct);
router.delete("/", authMiddleware.user, lostProductMiddleware.isMine, lostProductController.deleteLostProduct);
router.get("/search", authMiddleware.admin, lostProductController.searchLostProducts);

export default router;
