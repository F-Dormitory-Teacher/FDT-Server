import { Router } from "express";
import * as scheduleController from "../../controllers/schedule.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth.admin, scheduleController.turnOnSchedule);
router.delete("/", auth.admin, scheduleController.turnOffSchedule);

export default router;
