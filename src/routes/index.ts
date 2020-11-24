import { Router } from "express";
import auth from "./auth";
import attend from "./attend";
import notice from "./notice";
import schedule from "./schedule";

const router = Router();

router.use("/auth", auth);
router.use("/attend", attend);
router.use("/notice", notice);
router.use("/schedule", schedule);
export default router;
