import { Request, Response } from "express";

import autoSchedule from "../lib/autoSchedule";
import logger from "../lib/logger";

let schedule = null;

export const turnOnSchedule = (req: Request, res: Response) => {
  try {
    if (schedule) {
      logger.red("[POST] 스케줄 실행 실패.");
      res.status(409).json({
        message: "스케쥴이 이미 켜져있음."
      });
      return;
    }
    schedule = autoSchedule();
    logger.green("[POST] 스케줄 실행 성공.");
    logger.yellow("매 분 10초 일때 출석 리스트 작성", "(30초 초과시 NIGHT, 30초 미만시 MORNING)");
    res.status(200).json({
      status: 200,
      message: "스케쥴 실행 성공."
    });
  } catch (err) {
    logger.red("[POST] 스케쥴 작동 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export const turnOffSchedule = (req: Request, res: Response) => {
  try {
    if (!schedule) {
      logger.red("[DELETE] 스케줄 정지 실패.");
      res.status(404).json({
        message: "스케쥴이 안켜져있음."
      });
      return;
    }

    schedule.cancel();
    schedule = null;
    logger.green("[DELETE] 스케줄 정지 성공.");
    res.status(200).json({
      status: 200,
      message: "스케쥴 정지 성공."
    });
  } catch (err) {
    logger.red("[DELETE] 스케쥴 정지 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export const checkStatus = async (req: Request, res: Response) => {
  try {
    if (schedule) {
      res.status(200).json({
        isRunning: true
      });
      return;
    }
    res.status(200).json({
      isRunning: false
    });
  } catch (err) {
    logger.red("[POST] 스케쥴 상태 체크 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};
