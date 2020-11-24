import { Router } from "express";
import lostProductController from "../../controllers/lostProduct.controller";
import authMiddleware from "../../middleware/auth";
import lostProductMiddleware from "../../middleware/lostProduct";

const router = Router();

router.get("/", authMiddleware.loggedIn, lostProductController.getLostProducts);
router.post("/", authMiddleware.admin, lostProductController.createLostProduct);
router.patch("/", authMiddleware.admin, lostProductController.updateLostProduct);
router.delete("/", authMiddleware.loggedIn, lostProductMiddleware.isMine, lostProductController.deleteLostProduct);

export default router;
