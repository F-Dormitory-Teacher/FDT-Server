import { Router } from "express";
import auth from "./auth";
import attend from "./attend";
import notice from "./notice";

const router = Router();

router.use("/auth", auth);
router.use("/attend", attend);
router.use("/notice", notice);

export default router;
