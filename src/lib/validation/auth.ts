import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";

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

export const validateSendAuthCode = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    email: Joi.string().max(100).required()
  });

  return validate(req, res, schema);
};
