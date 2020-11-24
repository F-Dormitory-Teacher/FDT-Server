import * as Joi from "joi";
import validate from ".";
import { Request, Response } from "express";

export const validateCreateLostProduct = (req: Request, res: Response, isHasLostId: boolean = false): boolean => {
  const schema = Joi.object().keys({
    lostId: isHasLostId ? Joi.number().required() : "",
    title: isHasLostId ? "" : Joi.string().required(),
    location: isHasLostId ? "" : Joi.string().required(),
    content: isHasLostId ? "" : Joi.string().required(),
    lostStatus: isHasLostId ? Joi.string().required() : "",
    imageUrl: Joi.string()
  });

  return validate(req, res, schema);
};
