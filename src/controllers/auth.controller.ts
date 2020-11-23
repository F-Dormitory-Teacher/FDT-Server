import { Request, Response } from "express";
import { getRepository } from "typeorm";
import EmailAuthentication from "../entity/EmailAuthentication";
import User from "../entity/User";
import logger from "../lib/logger";
import { validateRegister } from "../lib/validation/auth";

const register = async (req: Request, res: Response) => {
  if (!validateRegister(req, res)) return;

  type RequestBody = {
    body: {
      email: string;
      pw: string;
      studentId: string;
      name: string;
    };
  };

  const { body }: RequestBody = req;

  try {
    const emailAuthRepo = getRepository(EmailAuthentication);
    const emailAuthentication: EmailAuthentication = await emailAuthRepo.findOne({ email: body.email });

    if (!emailAuthentication || !emailAuthentication.isCertified) {
      logger.yellow("[POST] 회원가입 인증 안된 이메일.");
      res.status(401).json({
        message: "인증 안된 이메일."
      });
      return;
    }

    const userRepo = getRepository(User);
    const isExist: User = await userRepo.findOne({ email: body.email });

    if (isExist) {
      logger.yellow("[POST] 회원가입 중복된 이메일");
      res.status(409).json({
        message: "중복된 이메일."
      });
      return;
    }

    const user: User = new User();

    user.email = body.email;
    user.studentId = body.studentId;
    user.name = body.name;
    user.pw = body.pw;

    logger.green("[POST] 회원가입 성공.");
    return res.status(200).json({
      status: 200,
      message: "가입 성공."
    });
  } catch (err) {
    logger.red("[POST] 회원가입 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  register
};
