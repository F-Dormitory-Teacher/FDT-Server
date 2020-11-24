import { Router } from "express";
import auth from "./auth";
import attend from "./attend";
import notice from "./notice";
import schedule from "./schedule";
import lostProduct from "./lostProduct";
import upload from "./upload";

const router = Router();

router.use("/auth", auth);
router.use("/attend", attend);
router.use("/notice", notice);
router.use("/schedule", schedule);
router.use("/lost-product", lostProduct);
router.use("/upload", upload);
export default router;
