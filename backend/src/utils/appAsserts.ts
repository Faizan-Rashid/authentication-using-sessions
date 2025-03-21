import assert from "node:assert";

import { HttpStatusCode } from "./../constants/https";
import AppError from "./AppError";
import { AppErrorCode } from "../constants/appErrorCode";

type AppAsserts = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAsserts = (
  condition,
  httpStatusCode,
  message,
  appErrorCode?
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
