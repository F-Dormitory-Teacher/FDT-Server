import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";
import AttendType from "../../enum/AttendType";
import AttendStatus from "../../enum/AttendStatus";

export const validateModify = (req: Request, res: Response): boolean => {
  const schema = Joi.object().keys({
    userIdx: Joi.number().integer().required(),
    date: Joi.date().format("YYYY-MM-DD").required(),
    type: Joi.string().valid([AttendType.MORNING, AttendType.NIGHT]).required(),
    status: Joi.string().valid([AttendStatus.TARDY, AttendStatus.ATTEND, AttendStatus.NONE]).required()
  });

  return validate(req, res, schema);
};
