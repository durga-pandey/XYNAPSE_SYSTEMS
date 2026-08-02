import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createTalentPool,
  getAllTalentPool,
  getSingleTalentPool,
  hardDeleteTalentPool,
  restoreTalentPool,
  softDeleteTalentPool,
  toggleActiveTalentPool,
  updateTalentStatus,
} from "../controllers/talentPool.js";

const talentPoolRouter = express.Router();

talentPoolRouter.post("/create", isAuthenticated, createTalentPool);

talentPoolRouter.get("/all", isAuthenticated, getAllTalentPool);

talentPoolRouter.get("/:id", isAuthenticated, getSingleTalentPool);

talentPoolRouter.patch("/update/:id", isAuthenticated, updateTalentStatus);

talentPoolRouter.patch("/toggle/:id", isAuthenticated, toggleActiveTalentPool);

talentPoolRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  softDeleteTalentPool
);

talentPoolRouter.patch("/restore/:id", isAuthenticated, restoreTalentPool);

talentPoolRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hardDeleteTalentPool
);

export default talentPoolRouter;
