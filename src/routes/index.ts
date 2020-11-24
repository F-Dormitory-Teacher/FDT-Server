import { Router } from "express";
import auth from "./auth";
import attend from "./attend";
import notice from "./notice";
import schedule from "./schedule";
import lostProduct from "./lostProduct";
import upload from "./upload";
import article from "./article";

const router = Router();

router.use("/auth", auth);
router.use("/attend", attend);
router.use("/notice", notice);
router.use("/schedule", schedule);
router.use("/lost-product", lostProduct);
router.use("/upload", upload);
router.use("/article", article);

export default router;
