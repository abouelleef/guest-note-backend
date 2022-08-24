import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { param, validationResult } from "express-validator";
import AppError from "../../utils/appError";

export const validator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const message = result
      .array()
      .reduce((current, error) => current + error.msg + " ", "");
    next(new AppError(message, StatusCodes.UNPROCESSABLE_ENTITY));

  } else next();
};

export const idValidation = [
  param("id").isUUID().withMessage("ID in not valid must br uuid"),
  validator,
];
