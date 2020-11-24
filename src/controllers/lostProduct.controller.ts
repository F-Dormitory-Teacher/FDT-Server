import { Request, Response } from "express";
import { getRepository } from "typeorm";
import logger from "../lib/logger";
import { validateCreateLostProduct } from "../lib/validation/lostProduct";
import LostProduct from "../entity/LostProduct";
import LostProductRequest from "../type/LostProductRequest";
import LostStatusType from "../enum/LostStatus";

const getLostProducts = async (req: Request, res: Response) => {
  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProducts = await lostProductRepo.find();

    logger.green("[GET] 분실물 리스트 불러오기 성공.");
    res.status(200).json({
      status: 200,
      message: "불러오기 성공.",
      lostProducts
    });
  } catch (err) {
    logger.red("[GET] 분실물 리스트 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const createLostProduct = async (req: LostProductRequest, res: Response) => {
  if (!validateCreateLostProduct) return;

  type RequestBody = {
    title: string;
    content: string;
    location: string;
    imageUrl: string;
    lostStatus: LostStatusType;
  };

  const body: RequestBody = req.body;
  const { title, content, location, imageUrl, lostStatus } = body;

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = new LostProduct();

    lostProduct.title = title;
    lostProduct.content = content;
    lostProduct.location = location;
    lostProduct.imageUrl = imageUrl;
    lostProduct.lostStatus = lostStatus;
    lostProduct.user = req.user;

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

const updateLostProduct = async (req: LostProductRequest, res: Response) => {
  if (!validateCreateLostProduct(req, res, true)) return;

  type RequestBody = {
    title: string;
    content: string;
    location: string;
    imageUrl: string;
    lostStatus: LostStatusType;
  };

  const body: RequestBody = req.body;
  const { title, content, location, imageUrl, lostStatus } = body;

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = req.lostProduct;

    lostProduct.title = title;
    lostProduct.content = content;
    lostProduct.location = location;
    lostProduct.imageUrl = imageUrl;
    lostProduct.lostStatus = lostStatus;

    lostProductRepo.save(lostProduct);

    logger.green("[PATCH] 분실물 수정 성공.");
    res.status(200).json({
      status: 200,
      message: "수정 성공."
    });
  } catch (err) {
    logger.red("[PATCH] 분실물 수정 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

const deleteLostProduct = async (req: LostProductRequest, res: Response) => {
  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = req.lostProduct;

    lostProductRepo.remove(lostProduct);
    logger.green("[DELETE] 분실물 삭제 성공.");
    res.status(200).json({
      status: 200,
      message: "삭제 성공."
    });
  } catch (err) {
    logger.red("[DELETE] 분실물 삭제 서버 오류.", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
  }
};

export default {
  getLostProducts,
  createLostProduct,
  updateLostProduct,
  deleteLostProduct
};
