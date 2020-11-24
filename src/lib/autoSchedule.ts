import * as schedule from "node-schedule";
import attendController from "../controllers/attend.controller";
import AttendType from "../enum/AttendType";

export default () =>
  // schedule.scheduleJob("0 30 6,17 * * *", () => {
  schedule.scheduleJob("* * * * * *", () => {
    // createAttendance();
    attendController.createAttendInit(new Date(), AttendType.MORNING);
  });
