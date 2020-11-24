import { NextFunction, Request, Response } from "express";
import { nextTick } from "process";
import { getRepository } from "typeorm";

import LostProduct from "../entity/LostProduct";
import logger from "../lib/logger";
import AuthRequest from "../type/AuthRequest";

const isMine = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lostProductRepo = getRepository(LostProduct);
    await lostProductRepo.findOne({
      user: {
        email: req.user.email
      }
    });
    next();
  } catch (err) {
    logger.red("본인 게시글 여부 검증 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default { isMine };
