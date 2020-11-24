import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";
import logger from "../logger";

export const validateLogin = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    pw: Joi.string().required()
  });

  return validate(req, res, schema);
};

export const validateRegister = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    email: Joi.string().max(100).required(),
    pw: Joi.string().max(256).required(),
    name: Joi.string().max(50).required(),
    studentId: Joi.string().max(4).required()
  });

  return validate(req, res, schema);
};

export const validateCertifyAuthCode = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    "auth-code": Joi.string().max(100).required()
  });
  const validation = Joi.validate(req.query, schema);

  if (validation.error) {
    logger.yellow("[JOI] 검증 오류", validation.error.message);

    res.status(400).json({
      status: 400,
      message: "검증 오류."
    });

    return false;
  }
  return true;
};

export const validateSendAuthCode = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    email: Joi.string().max(100).required()
  });

  return validate(req, res, schema);
};
