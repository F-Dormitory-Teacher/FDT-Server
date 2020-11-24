import { Request, Response } from "express";
import { getRepository } from "typeorm";
import logger from "../lib/logger";
import { validateCreateLostProduct } from "../lib/validation/lostProduct";
import LostProduct from "../entity/LostProduct";

const createLostProduct = async (req: Request, res: Response) => {
  if (!validateCreateLostProduct) return;

  type RequestBody = {
    title: string;
    content: string;
    location: string;
    imageUrl: string;
  };

  const body: RequestBody = req.body;
  const { title, content, location, imageUrl } = body;

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = new LostProduct();

    lostProduct.title = title;
    lostProduct.content = content;
    lostProduct.location = location;
    lostProduct.imageUrl = imageUrl;

    lostProductRepo.save(lostProduct);

    logger.green("[POST] 분실물 생성 성공.");
    res.status(200).json({
      status: 200,
      message: "생성 성공."
    });
  } catch (err) {
    logger.red("[POST] 분실물 생성 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  createLostProduct
};
