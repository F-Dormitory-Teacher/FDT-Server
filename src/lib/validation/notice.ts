import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";
import AttendType from "../../enum/AttendType";

export const validateCreate = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    title: Joi.string().max(100).required(),
    content: Joi.string().min(1).required(),
    date: Joi.date().format("YYYY-MM-DD").required(),
    type: Joi.string().valid([AttendType.MORNING, AttendType.NIGHT]).required()
  });

  return validate(req, res, schema);
};

export const validateModify = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    title: Joi.string().max(100),
    content: Joi.string().min(1),
    date: Joi.date().format("YYYY-MM-DD").required(),
    type: Joi.string().valid([AttendType.MORNING, AttendType.NIGHT]).required()
  });

  return validate(req, res, schema);
};
