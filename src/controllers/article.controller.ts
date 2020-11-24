import { Request, Response } from "express";
import logger from "../lib/logger";
import { validateCreate } from "../lib/validation/article";
import AuthRequest from "../type/AuthRequest";

const createArticle = (req: AuthRequest, res: Response) => {
  if (!validateCreate(req, res)) return;

  type RequestBody = {
    body: {
      title: string;
      content: string;
      image?: string;
    };
  };

  const { body }: RequestBody = req;
  try {
  } catch (err) {
    logger.red("[POST] 물품 신청 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {};
