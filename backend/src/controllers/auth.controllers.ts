import { clearAuthCookies } from "./../utils/cookies";
import catchErrors from "../utils/catchErrors";
import {
  createAcccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.services";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/https";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  VerificationCodeSchema,
} from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAsserts";

export const registerHandler = catchErrors(async (req, res, next) => {
  // validate req
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { user, accessToken, refreshToken } = await createAcccount(request);

  // return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res, next) => {
  // validate req
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { accessToken, refreshToken } = await loginUser(request);

  // return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successful",
  });
});

export const logoutHandler = catchErrors(async (req, res, next) => {
  const { payload } = verifyToken(req.cookies.accessToken);

  console.log(payload);
  if (payload) {
    console.log(`in if`);
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "logout successful" });
});

export const refreshHandler = catchErrors(async (req, res, next) => {
  const refreshToken = (req.cookies.refreshToken as string) || undefined;

  appAssert(refreshToken, UNAUTHORIZED, "refresh token expired");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken)
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

export const verifyEmailHandler = catchErrors(async (req, res, next) => {
  const verificationCode = VerificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email verified successfully" });
});

export const sendPasswordResetEmailHandler = catchErrors(
  async (req, res, next) => {
    const email = emailSchema.parse(req.body.email);

    await sendPasswordResetEmail(email);

    return res.status(OK).json({
      message: "Password reset email sent succesfully",
    });
  }
);

export const resetPasswordHandler = catchErrors(async (req, res, next) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res).status(OK).json({
    message: "Password reset successfully",
  });
});
