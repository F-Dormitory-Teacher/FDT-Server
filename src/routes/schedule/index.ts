import { Router } from "express";
import * as scheduleController from "../../controllers/schedule.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth.admin, scheduleController.turnOnSchedule);
router.delete("/", auth.admin, scheduleController.turnOffSchedule);
router.get("/status", auth.admin, scheduleController.checkStatus);

export default router;
