import { Response } from "express";
import logger from "../lib/logger";

const upload = async (req: any, res: Response) => {
  try {
    const reqFiles = req.files;
    const files: string[] = [];
    let fileName: string;

    if (reqFiles) {
      reqFiles.forEach(async (reqFile: any) => {
        files.push(reqFile.filename);
      });

      fileName = files[0];

      logger.green("[POST] 파일 업로드 성공.");
      return res.status(200).json({
        status: 200,
        message: "파일 업로드 성공.",
        data: {
          file: fileName
        }
      });
    } else {
      logger.yellow("[POST] 이미지 업로드 검증 오류");
      res.status(400).json({
        status: 400,
        message: "검증 오류"
      });
      return;
    }
  } catch (err) {
    logger.red("[POST] 파일 업로드 서버 오류.", err.message);
    res.status(500).json({
      status: 500,
      message: "서버 오류."
    });
    return;
  }
};

export default {
  upload
};
