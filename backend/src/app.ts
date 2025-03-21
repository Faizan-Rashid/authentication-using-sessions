import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/https";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.get(
  "/",
  catchErrors(async (req, res, next) => {
    res.status(OK).json({
      status: "healthy",
    });
  })
);
// auth routes
app.use("/api/v1/auth", authRoutes);

// protected routes
app.use("/api/v1/user", authenticate, userRoutes);

app.use("/api/v1/session", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT} in ${NODE_ENV}`);
  connectDB();
});
