import { Request, Response } from "express";
import * as moment from "moment";
import { toDataURL } from "qrcode";
import { FindManyOptions, getRepository, Like } from "typeorm";
import Attendance from "../entity/Attendance";
import User from "../entity/User";
import AttendStatus from "../enum/AttendStatus";
import AttendType from "../enum/AttendType";
import attendTime from "../lib/attendTime";
import logger from "../lib/logger";
import getAttendType from "../lib/util/getAttendType";
import { validateModify } from "../lib/validation/attend";
import AuthRequest from "../type/AuthRequest";

const getQrCode = async (req: Request, res: Response) => {
  try {
    const type: AttendType = new Date().getHours() > 8 ? AttendType.NIGHT : AttendType.MORNING;

    const qrcode = await toDataURL(
      JSON.stringify({
        type: type,
        date: moment().format("yyyy-MM-DD")
      })
    );

    const image = Buffer.from(qrcode.replace(/.*,/, ""), "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": image.length
    });
    res.end(image);
  } catch (err) {
    logger.red("[GET] QR CODE 생성 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const getMyAttend = async (req: AuthRequest, res: Response) => {
  const user: User = req.user;

  type RequestQuery = {
    type?: AttendType;
    date?: Date;
  };

  const query: RequestQuery = req.query;

  if (!query.date) {
    logger.yellow("[GET] 검증 오류.");
    return res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
  }

  try {
    const queryConditions: FindManyOptions = {
      where: {
        type: null,
        date: query.date,
        user
      }
    };

    if (query.type) {
      queryConditions.where["type"] = query.type;
    }

    const AttendRepo = getRepository(Attendance);
    let attendances: Attendance[] | Attendance | {} = await AttendRepo.find(queryConditions);

    if (query.type) {
      if (attendances) {
        attendances = attendances[0];
      } else {
        attendances = {};
      }
    }

    logger.green("[GET] 내 출석 정보 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "내 출석 정보 조회 성공.",
      data: {
        attendances
      }
    });
  } catch (err) {
    logger.red("[GET] 내 출석 정보 조회 서버 오류.");
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const getAttends = async (req: AuthRequest, res: Response) => {
  type RequestQuery = {
    type?: AttendType;
    date?: Date;
    studentId?: string;
  };

  const query: RequestQuery = req.query;

  try {
    const queryConditions: FindManyOptions = {
      where: {
        type: null,
        date: null,
        user: null
      }
    };

    if (query.studentId) {
      const userRepo = getRepository(User);
      const user: User = await userRepo.findOne({ where: { studentId: Like(`%${query.studentId}%`) } });

      if (!user) {
        logger.yellow("[GET] 출석 정보 리스트 조회 유저 없음.");
        return res.status(404).json({
          status: 404,
          message: "유저 없음."
        });
      }
      queryConditions.where["user"] = user;
    }

    if (query.date) {
      queryConditions.where["date"] = query.date;
    }

    if (query.type) {
      queryConditions.where["type"] = query.type;
    }

    const AttendRepo = getRepository(Attendance);
    const attendances: Attendance[] = await AttendRepo.find(queryConditions);

    logger.green("[GET] 출석 정보 리스트 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "출석 정보 리스트 조회 성공.",
      data: {
        attendances
      }
    });
  } catch (err) {
    logger.red("[GET] 출석 정보 리스트 조회 서버 오류.");
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const createAttend = async (req: AuthRequest, res: Response) => {
  const user: User = req.user;

  try {
    const type: AttendType | boolean = getAttendType();

    if (!type || typeof type === "boolean") {
      logger.yellow("[POST] 아직 출석체크가 불가능합니다.");
      return res.status(403).json({
        status: 403,
        message: "아직 출석체크 불가."
      });
    }

    const attendRepo = getRepository(Attendance);
    const isExist = await attendRepo.findOne({ where: { user, type, date: new Date() } });

    if (isExist) {
      logger.yellow("[POST] 이미 출석체크된 유저.");
      return res.status(409).json({
        status: 409,
        message: "이미 출석한 유저."
      });
    }

    const today: Date = new Date();
    let status: AttendStatus;

    if (type === AttendType.MORNING) {
      status =
        attendTime.MORNING_END_TIME > today.getHours() && attendTime.MORNING_START_TIME <= today.getHours()
          ? AttendStatus.ATTEND
          : AttendStatus.TARDY;
    } else {
      status =
        attendTime.NIGHT_END_TIME > today.getHours() && attendTime.NIGHT_START_TIME <= today.getHours()
          ? AttendStatus.ATTEND
          : AttendStatus.TARDY;
    }

    const attend: Attendance = new Attendance();

    attend.user = user;
    attend.type = type;
    attend.date = today;
    attend.status = AttendStatus.ATTEND;

    await attendRepo.save(attend);

    logger.green("[POST] 출석체크 성공.");
    return res.status(200).json({
      status: 200,
      message: "출석체크 성공."
    });
  } catch (err) {
    logger.red("[POST] 출석체크 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const createAttendInit = async (date: Date, type: AttendType) => {
  try {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ where: { isAdmin: false } });

    const attendRepo = getRepository(Attendance);
    const attends: Attendance[] = [];

    users.map((user: User, idx: number) => {
      const attend: Attendance = new Attendance();
      attend.user = user;
      attend.status = AttendStatus.NONE;
      attend.date = date;
      attend.type = type;

      attends.push(attend);
    });

    await attendRepo.save(attends);
  } catch (err) {
    logger.red("[POST] 출석체크 초기화 실패.", err.message);
  }
};

const modifyAttend = async (req: AuthRequest, res: Response) => {
  if (!validateModify(req, res)) return;

  type RequestBody = {
    body: {
      userIdx: number;
      date: Date;
      type: AttendType;
      status: AttendStatus;
    };
  };

  const { body }: RequestBody = req;

  try {
    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({ idx: body.userIdx });

    if (!user) {
      logger.yellow("[PUT] 유저 없음.");
      return res.status(404).json({
        status: 404,
        message: "유저 없음."
      });
    }

    const attendRepo = getRepository(Attendance);
    const attend = await attendRepo.findOne({ where: { user, type: body.type, date: body.date } });

    if (!attend) {
      logger.yellow("[PUT] 출석 정보 없음.");
      return res.status(404).json({
        status: 404,
        message: "출석 정보 없음."
      });
    }

    attend.status = body.status;

    await attendRepo.save(attend);

    logger.green("[PUT] 출석체크 수정 성공.");
    return res.status(200).json({
      status: 200,
      message: "출석체크 수정 성공."
    });
  } catch (err) {
    logger.red("[PUT] 출석체크 수정 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  getQrCode,
  getMyAttend,
  getAttends,
  createAttend,
  createAttendInit,
  modifyAttend
};
