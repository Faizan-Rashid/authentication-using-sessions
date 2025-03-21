import { ErrorRequestHandler, Response } from "express";
import { z, ZodError } from "zod";

import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/https";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.issues.map((err) => ({
    message: err.message,
    path: err.path.join("."),
  }));

  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  console.log(`PATH: ${req.path}`, error);
  
  if (req.path === REFRESH_PATH) clearAuthCookies(res);

  if (error instanceof z.ZodError) return handleZodError(res, error);

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }
  return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

export default errorHandler;
