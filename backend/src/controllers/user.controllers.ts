import { NOT_FOUND, OK } from "../constants/https";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAsserts";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.userId);

  appAssert(user, NOT_FOUND, "User not found");

  res.status(OK).json(user.omitPassword());
});
