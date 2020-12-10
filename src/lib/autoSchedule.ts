import * as schedule from "node-schedule";
import attendController from "../controllers/attend.controller";
import AttendType from "../enum/AttendType";
import logger from "./logger";

export default () =>
  // schedule.scheduleJob("0 0 6,21 * * *", () => {
  schedule.scheduleJob("30 * * * * *", () => {
    const time = new Date();
    console.log(new Date());
    // const isMorning = time.getHours() > 8
    const isNight = time.getSeconds() > 30;
    logger.yellow("매 분 10초 일때 출석 리스트 작성", "(30초 초과시 NIGHT, 30초 미만시 MORNING)");
    attendController.createAttendInit(new Date(), AttendType[isNight ? "NIGHT" : "MORNING"]);
  });
