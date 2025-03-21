import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "./../utils/emailTemplates";
import { verificationCodeType } from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import {
  fiveMinutesFromNow,
  ONE_DAY,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/date";
import appAssert from "../utils/appAsserts";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/https";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { APP_ORIGIN, JWT_REFRESH_SECRET } from "../constants/env";
import { sendEmail } from "../utils/sendMail";
import { hashValue } from "../utils/bcrypt";

export type CreateAcccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAcccount = async (data: CreateAcccountParams) => {
  // verify email/existing user doesnot exists
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(
    !existingUser,
    CONFLICT,
    `user with email ${data.email} already exists`
  );

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  const userId = user._id;

  // create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // send verification email
  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  const { error } = await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) console.log(error);

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  // sign access token & refresh token
  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );
  const accessToken = signToken({
    sessionId: session._id,
    userId,
  });

  // return user & tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, `Invalid email or password`);

  // validate password
  const isValid = await user.comparePassword(password);
  appAssert(isValid, CONFLICT, `Invalid email or password`);

  // create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  // sign access and refresh tokens
  const sessionInfo = { sessionId: session._id };

  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  // return user & tokens
  return {
    user: user.omitPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: JWT_REFRESH_SECRET,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);

  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // if session is going to expire in 24 hours, then refresh it
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  // get verification code
  const verificationCode = await VerificationCodeModel.findOne({
    _id: code,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(
    verificationCode,
    NOT_FOUND,
    "verification code invalid or expired"
  );

  // get user by id
  // update user to verified true
  const updatedUser = await UserModel.findByIdAndUpdate(
    verificationCode.userId,
    {
      verified: true,
    },
    { updated: true }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "failed to verify email");

  // delete verification code
  await verificationCode.deleteOne();

  // return user
  return { user: updatedUser.omitPassword() };
};

export const sendPasswordResetEmail = async (email: string) => {
  // get user by email
  const user = await UserModel.findOne({
    email,
  });

  appAssert(user, NOT_FOUND, "User not found");

  // check email rate limit
  const fiveMinAgo = fiveMinutesFromNow();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo },
  });
  appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many request, try agin later");

  // create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    expiresAt,
  });

  // send verification email
  const url: string = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&expiresAt=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  //  return success
  return {
    url,
    emailId: data.id,
  };
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: verificationCodeType.PasswordReset,
    expiresAt: { $gt: Date.now() },
  });
  appAssert(validCode, NOT_FOUND, "Inavlid or expired verificaton code");

  // update user's password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to update user");

  // delete '_id' does not exist on type  the verification code
  await validCode.deleteOne();

  // delete all sessions of that user so to remove from all devices
  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });

  return {
    user: updatedUser.omitPassword(),
  };
};
