import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";
import AttendStatus from "../../enum/AttendStatus";
import ArticleStatus from "../../enum/ArticleStatus";

export const validateCreate = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    title: Joi.string().max(100).required(),
    content: Joi.string().min(1).required(),
    image: Joi.string()
  });

  return validate(req, res, schema);
};

export const validateModify = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    title: Joi.string().max(100),
    content: Joi.string(),
    image: Joi.string()
  });

  return validate(req, res, schema);
};

export const validateChange = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    status: Joi.string().valid([ArticleStatus.COMPLETED, ArticleStatus.HOLDED, ArticleStatus.NONE]).required()
  });

  return validate(req, res, schema);
};
