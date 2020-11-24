import { Request, Response } from "express";
import { Binary, FindManyOptions, getRepository } from "typeorm";
import Notice from "../entity/Notice";
import AttendType from "../enum/AttendType";
import logger from "../lib/logger";
import { validateModify } from "../lib/validation/attend";
import { validateCreate } from "../lib/validation/notice";
import AuthRequest from "../type/AuthRequest";

const getNotice = async (req: Request, res: Response) => {
  type RequestQuery = {
    type?: AttendType;
    date?: Date;
  };

  const query: RequestQuery = req.query;

  try {
    const queryConditions: FindManyOptions = {
      where: {}
    };

    if (query.type) {
      queryConditions.where["type"] = query.type;
    }

    if (query.date) {
      queryConditions.where["date"] = query.date;
    }

    const noticeRepo = getRepository(Notice);
    const notices: Notice[] = await noticeRepo.find(queryConditions);

    logger.green("[GET] 공지 조회 성공.");
    return res.status(200).json({
      status: 200,
      message: "공지 조회 성공.",
      data: {
        notices
      }
    });
  } catch (err) {
    logger.red("[GET] 공지 조회 서버 오류.");
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const createNotice = async (req: AuthRequest, res: Response) => {
  if (!validateCreate(req, res)) return;

  type RequestBody = {
    body: {
      type: AttendType;
      date: Date;
      title: string;
      content: string;
    };
  };

  const { body }: RequestBody = req;

  try {
    const noticeRepo = getRepository(Notice);
    const isExist = await noticeRepo.findOne({ where: { date: body.date, type: body.type } });

    if (isExist) {
      logger.yellow("[POST] 이미 작성된 안내사항.");
      return res.status(409).json({
        status: 409,
        message: "이미 작성된 안내사항."
      });
    }

    const notice: Notice = new Notice();

    notice.title = body.title;
    notice.content = body.content;
    notice.date = body.date;
    notice.type = body.type;

    await noticeRepo.save(notice);

    logger.green("[POST] 안내사항 작성 성공.");
    return res.status(200).json({
      status: 200,
      message: "안내사항 작성 성공."
    });
  } catch (err) {
    logger.red("[POST] 안내사항 작성 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const modifyNotice = async (req: AuthRequest, res: Response) => {
  if (!validateModify(req, res)) return;

  type RequestBody = {
    body: {
      type: AttendType;
      date: Date;
      title?: string;
      content?: string;
    };
  };

  const { body }: RequestBody = req;

  try {
    const noticeRepo = getRepository(Notice);
    const isExist = await noticeRepo.findOne({ where: { date: body.date, type: body.type } });

    if (!isExist) {
      logger.yellow("[PUT] 안내사항 없음.");
      return res.status(404).json({
        status: 404,
        message: "안내사항 없음."
      });
    }

    isExist.title = body.title || isExist.title;
    isExist.content = body.content || isExist.content;
    isExist.date = body.date;
    isExist.type = body.type;

    await noticeRepo.save(isExist);

    logger.green("[PUT] 안내사항 수정 성공.");
    return res.status(200).json({
      status: 200,
      message: "안내사항 수정 성공."
    });
  } catch (err) {
    logger.red("[PUT] 안내사항 수정 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  getNotice,
  createNotice,
  modifyNotice
};
