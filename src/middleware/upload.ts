import * as multer from "multer";
import { Options } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import logger from "../lib/logger";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, process.cwd() + "/public");
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, `${file.fieldname}-${uuidv4()}-${file.originalname}`);
  }
});

const limits = {
  fileSize: 5 * 1024 * 1024
};

const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(new Error());
  }
  callback(null, true);
};

const options: Options = {
  storage,
  limits,
  fileFilter
};

const uploadMid = multer(options).array("files");

export default (req: Request, res: Response, next: NextFunction) => {
  uploadMid(req, res, (err: any) => {
    if (err) {
      logger.yellow("[POST] 이미지 업로드 검증 오류", err.message);
      res.status(400).json({
        status: 400,
        message: "검증 오류"
      });
      return;
    }
    next();
  });
};
