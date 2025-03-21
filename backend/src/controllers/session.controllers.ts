import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/https";
import SessionModel from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAsserts";

export const getSessionHandler = catchErrors(async (req, res, next) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      expiresAt: 1,
      userAgent: 1,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  return res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionHandler = catchErrors(async (req, res, next) => {
  const sessionId = z.string().parse(req.params.id);

  const deletedSession = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  console.log(deletedSession);
  appAssert(deletedSession, NOT_FOUND, "Session not found");

  res.status(OK).json({
    message: "session deleted successfully",
  });
});
