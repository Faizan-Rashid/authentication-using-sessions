import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  sendPasswordResetEmailHandler,
  verifyEmailHandler,
} from "../controllers/auth.controllers";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);

authRoutes.post("/login", loginHandler);

authRoutes.post("/logout", logoutHandler);

authRoutes.get("/refresh", refreshHandler);

authRoutes.get("/email/verify/:code", verifyEmailHandler);

authRoutes.post("/password/forgot", sendPasswordResetEmailHandler);

authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
