import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as moment from "moment";
import EmailAuthentication from "../entity/EmailAuthentication";
import User from "../entity/User";
import logger from "../lib/logger";
import { validateCertifyAuthCode, validateLogin, validateRegister, validateSendAuthCode } from "../lib/validation/auth";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../lib/util/sendEmail";
import { createToken } from "../lib/token";

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

    userRepo.save(user);

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

const login = async (req: Request, res: Response) => {
  if (!validateLogin(req, res)) return;

  type RequestBody = {
    body: {
      email: string;
      pw: string;
    };
  };

  const {
    body: { email, pw }
  }: RequestBody = req;

  try {
    const userRepo = getRepository(User);
    const user: User | undefined = await userRepo.findOne({ email, pw });

    if (!user) {
      logger.yellow("[POST] 회원가입 인증 안된 이메일.");
      res.status(404).json({
        message: "일치하는 계정을 찾을 수 없음."
      });
      return;
    }
    logger.green("[POST] 로그인 성공.");
    res.status(200).json({
      status: 200,
      message: "로그인 성공.",
      accessToken: await createToken(email)
    });
  } catch (err) {
    logger.red("[POST] 로그인 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const certifyAuthCode = async (req: Request, res: Response) => {
  if (!validateCertifyAuthCode(req, res)) return;

  const authCode: string = req.query["auth-code"] as string;

  try {
    const emailAuthRepo = getRepository(EmailAuthentication);
    const emailAuthentication: EmailAuthentication | undefined = await emailAuthRepo.findOne({ authCode });

    if (!emailAuthentication) {
      res.status(404).json({
        message: "코드 인증 실패."
      });
      return;
    }

    if (moment(Date.now()).isAfter(emailAuthentication.expireAt)) {
      res.status(409).json({
        message: "유효기간 만료."
      });
      return;
    }

    emailAuthentication.isCertified = true;
    emailAuthRepo.save(emailAuthentication);

    logger.green("[POST] 인증 코드 검증 성공.");
    res.status(200).json({
      status: 200,
      message: "검증 성공."
    });
    return;
  } catch (err) {
    logger.red("[GET] 인증 코드 검증 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const sendAuthCode = async (req: Request, res: Response) => {
  if (!validateSendAuthCode(req, res)) return;

  type RequestBody = {
    body: {
      email: string;
    };
  };

  const {
    body: { email }
  }: RequestBody = req;
  const authCode = uuidv4();

  sendEmail(email, "FDT 인증 코드입니다.", authCode)
    .then(async () => {
      try {
        const EXPIRED_MINUTE = 10;
        const emailAuthRepo = getRepository(EmailAuthentication);
        const emailAuthentication: EmailAuthentication | undefined = await emailAuthRepo.findOne({ email });
        const newEmailAuthentication: EmailAuthentication = new EmailAuthentication();

        if (emailAuthentication) {
          emailAuthentication.authCode = authCode;
          emailAuthentication.expireAt = new Date(moment().add(EXPIRED_MINUTE, "minutes").format("YYYY-MM-DDTHH:mm:ss"));

          await emailAuthRepo.update(emailAuthentication.authCode, emailAuthentication);
          res.status(200).json({
            status: 200,
            message: "전송 성공."
          });
          return;
        }

        newEmailAuthentication.email = email;
        newEmailAuthentication.authCode = authCode;
        newEmailAuthentication.expireAt = new Date(moment().add(EXPIRED_MINUTE, "minutes").format("YYYY-MM-DDTHH:mm:ss"));

        await emailAuthRepo.save(newEmailAuthentication);

        logger.green("[POST] 인증 코드 전송 성공.");
        res.status(200).json({
          status: 200,
          message: "전송 성공."
        });
        return;
      } catch (err) {
        logger.red("[POST] 인증 코드 전송 서버 오류.", err.message);
        res.status(500).json({
          status: 500,
          message: "서버 오류."
        });
        return;
      }
    })
    .catch((err) => console.log(err));
  res.status(200).json({
    status: 200,
    message: "전송 성공."
  });
};

export default {
  register,
  login,
  certifyAuthCode,
  sendAuthCode
};
