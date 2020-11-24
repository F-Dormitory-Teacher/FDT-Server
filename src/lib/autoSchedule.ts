import * as schedule from "node-schedule";
import attendController from "../controllers/attend.controller";
import AttendType from "../enum/AttendType";

export default () =>
  // schedule.scheduleJob("0 0 8,21 * * *", () => {
  schedule.scheduleJob("10 * * * * *", () => {
    const time = new Date();
    console.log(new Date());
    // const isMorning = time.getHours() > 8
    const isNight = time.getSeconds() > 30;
    attendController.createAttendInit(new Date(), AttendType[isNight ? "NIGHT" : "MORNING"]);
  });
