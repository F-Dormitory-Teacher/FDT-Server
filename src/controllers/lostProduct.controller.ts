import { Request, Response } from "express";
import { getRepository } from "typeorm";
import logger from "../lib/logger";
import { validateCreateLostProduct } from "../lib/validation/lostProduct";
import LostProduct from "../entity/LostProduct";
import LostProductRequest from "../type/LostProductRequest";
import LostStatusType from "../enum/LostStatus";
import LostProductList from "../type/LostProductList";
import User from "../entity/User";

const getLostProducts = async (req: Request, res: Response) => {
  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProducts: LostProductList[] = await lostProductRepo.find();

    const userRepo = getRepository(User);
    for (let i in lostProducts) {
      const user: User = await userRepo.findOne({ idx: lostProducts[i].userIdx });

      lostProducts[i].userName = user.name;
      lostProducts[i].userStudentId = user.studentId;
    }

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

const getLostProduct = async (req: Request, res: Response) => {
  const idx: number = Number(req.params.idx);

  if (isNaN(idx)) {
    logger.yellow("[DELETE] 검증 오류.", "idx is NaN");
    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });
    return;
  }

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct: LostProductList = await lostProductRepo.findOne({ idx });

    if (!lostProduct) {
      logger.yellow("[GET] 분실물 없음.");
      return res.status(404).json({
        status: 404,
        message: "분실물 없음."
      });
    }

    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({ idx: lostProduct.userIdx });

    lostProduct.userName = user.name;
    lostProduct.userStudentId = user.studentId;

    logger.green("[GET] 분실물 리스트 불러오기 성공.");
    res.status(200).json({
      status: 200,
      message: "불러오기 성공.",
      lostProduct
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
  if (!validateCreateLostProduct(req, res)) return;

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
  const { lostStatus } = body;

  try {
    const lostProductRepo = getRepository(LostProduct);
    const lostProduct = req.lostProduct;

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
  getLostProduct,
  deleteLostProduct
};
