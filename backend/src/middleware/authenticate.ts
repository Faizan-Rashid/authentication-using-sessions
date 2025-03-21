import { RequestHandler } from "express";
import appAssert from "../utils/appAsserts";
import { UNAUTHORIZED } from "../constants/https";
import { AppErrorCode } from "../constants/appErrorCode";
import {  verifyToken } from "../utils/jwt";

export const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.invalidAccessToken
  );

  const { payload, error } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.invalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};
