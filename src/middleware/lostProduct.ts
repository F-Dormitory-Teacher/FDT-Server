import { NextFunction, Response } from "express";
import { getRepository } from "typeorm";

import LostProduct from "../entity/LostProduct";
import logger from "../lib/logger";
import LostProductRequest from "../type/LostProductRequest";

const isMine = async (req: LostProductRequest, res: Response, next: NextFunction) => {
  const lostId: number = req.body.lostId;
  if (!lostId) {
    res.status(400).json({
      status: 400,
      message: "BAD REQUEST 'lostId' is required"
    });
    return;
  }

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = await lostProductRepo.findOne(lostId);

    if (!lostProduct) {
      res.status(404).json({
        status: 404,
        message: "NOT FOUND"
      });
      return;
    }

    if (lostProduct.userIdx !== req.user.idx && !req.user.isAdmin) {
      logger.red("본인 게시글 여부 검증 실패.");
      res.status(403).json({
        status: 403,
        message: "본인 게시글만 접근 가능."
      });
      return;
    }
    req.lostProduct = lostProduct;
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
