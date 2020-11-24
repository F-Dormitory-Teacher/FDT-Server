import { getRepository } from "typeorm";

import Attendance from "../entity/Attendance";
import User from "../entity/User";
import logger from "../lib/logger";

export const createAttendance = async () => {
  try {
    const userRepo = getRepository(User);
    const attendanceRepo = getRepository(Attendance);

    const users = await userRepo.find({
      where: {
        isAdmin: false
      }
    });
    const attendences: Attendance[] | undefined = await attendanceRepo.find();
    const newAttendances: Attendance[] = [];

    let attendanceId;

    if (attendences.length) {
      attendanceId = attendences[attendences.length - 1].attendanceId + 1;
    }

    for await (let user of users) {
      const attendance = new Attendance();

      attendance.attendanceId = attendanceId;
      attendance.user = user;
      await newAttendances.push(attendance);
    }

    await attendanceRepo.save(newAttendances);
    logger.green("[POST] 출석체크 명단 생성 성공.");
  } catch (e) {
    console.log(e.message);
    logger.red("[CREATE ATTENDANCE] 출석 생성 실패.");
  }
};
