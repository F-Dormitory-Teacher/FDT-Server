import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";
import LostStatusType from "../../enum/LostStatus";

export const validateCreateLostProduct = (req: Request, res: Response, isHasLostId: boolean = false): boolean => {
  const schema = Joi.object().keys({
    lostId: isHasLostId ? Joi.number().required() : "",
    title: Joi.string().required(),
    location: Joi.string().required(),
    content: Joi.string().required(),
    lostStatus: isHasLostId ? Joi.string().valid([LostStatusType.KEEP, LostStatusType.LOSTED]).required() : "",
    imageUrl: Joi.string()
  });

  return validate(req, res, schema);
};
