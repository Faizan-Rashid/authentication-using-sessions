import { Router } from "express";
import {
  deleteSessionHandler,
  getSessionHandler,
} from "../controllers/session.controllers";

const sessionRoutes = Router();

sessionRoutes.get("/", getSessionHandler);

sessionRoutes.delete("/:id", deleteSessionHandler);

export default sessionRoutes;
