import { Router } from "express";
import articleController from "../../controllers/article.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/createArticle", authMiddleware.user, articleController.createArticle);
router.get("/getMyArticles", authMiddleware.user, articleController.getMyArticles);
router.get("/getArticles", articleController.getArticles);
router.get("/getArticle/:idx", articleController.getArticle);
router.put("/changeArticle/:idx", authMiddleware.admin, articleController.changeArticle);
router.delete("/deleteArticle/:idx", authMiddleware.user, articleController.deleteArticle);
router.put("/modifyArticle/:idx", authMiddleware.user, articleController.modifyArticle);

export default router;
