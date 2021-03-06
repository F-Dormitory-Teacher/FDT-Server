import { Response, NextFunction } from "express";
import { verifyToken } from "../lib/token";
import { getRepository } from "typeorm";
import User from "../entity/User";
import logger from "../lib/logger";
import AuthRequest from "../type/AuthRequest";

const loggedIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user: User = await validateAuth(req);
    req.user = user;
    next();
  } catch (err) {
    switch (err.message) {
      case "TOKEN_IS_ARRAY":
      case "NO_TOKEN":
      case "INVALID_TOKEN":
      case "NO_USER":
        res.status(401).json({
          status: 401,
          message: "인증 되지 않음"
        });
        return;
      case "EXPIRED_TOKEN":
        res.status(410).json({
          status: 410,
          message: "토큰 만료"
        });
        return;
      default:
        logger.red("토큰 검증 서버 오류.", err.message);
        res.status(500).json({
          status: 500,
          message: "서버 오류."
        });
    }
  }
};

const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user: User = await validateAuth(req);

    if (!user.isAdmin) {
      return res.status(403).json({
        status: 403,
        message: "권한 없음."
      });
    }
    req.user = user;
    next();
  } catch (err) {
    switch (err.message) {
      case "TOKEN_IS_ARRAY":
      case "NO_TOKEN":
      case "INVALID_TOKEN":
      case "NO_USER":
        res.status(401).json({
          status: 401,
          message: "인증 되지 않음"
        });
        return;
      case "EXPIRED_TOKEN":
        res.status(410).json({
          status: 410,
          message: "토큰 만료"
        });
        return;
      default:
        logger.red("토큰 검증 서버 오류.", err.message);
        res.status(500).json({
          status: 500,
          message: "서버 오류."
        });
    }
  }
};

const user = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user: User = await validateAuth(req);
    req.user = user;
    next();
  } catch (err) {
    switch (err.message) {
      case "TOKEN_IS_ARRAY":
      case "NO_TOKEN":
      case "INVALID_TOKEN":
      case "NO_USER":
        res.status(401).json({
          status: 401,
          message: "인증 되지 않음."
        });
        return;
      case "EXPIRED_TOKEN":
        res.status(410).json({
          status: 410,
          message: "토큰 만료"
        });
        return;
      default:
        logger.red("토큰 검증 서버 오류.", err.message);
        res.status(500).json({
          status: 500,
          message: "서버 오류."
        });
    }
  }
};

const validateAuth = async (req: AuthRequest) => {
  const reqToken: string | string[] = req.headers.authorization;

  if (Array.isArray(reqToken)) {
    throw new Error("TOKEN_IS_ARRAY");
  }

  if (!reqToken) {
    throw new Error("NO_TOKEN");
  }

  const token = reqToken.replace("Bearer ", "");
  try {
    const decoded = await verifyToken(token);

    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({
      where: {
        email: decoded.id
      }
    });

    if (!user) {
      throw new Error("NO_USER");
    }

    return user;
  } catch (err) {
    switch (err.message) {
      case "jwt must be provided":
        throw new Error("NO_TOKEN");
      case "jwt malformed":
      case "invalid token":
      case "invalid signature":
        throw new Error("INVALID_TOKEN");
      case "jwt expired":
        throw new Error("EXPIRED_TOKEN");
      default:
        throw err;
    }
  }
};

export default {
  loggedIn,
  admin,
  user
};
