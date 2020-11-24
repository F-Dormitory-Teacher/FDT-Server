import * as schedule from "node-schedule";
// import { createAttendance } from "../controllers/attendance.controller";

export default () =>
  // schedule.scheduleJob("0 30 6,17 * * *", () => {
  schedule.scheduleJob("* * * * * *", () => {
    // createAttendance();
  });
