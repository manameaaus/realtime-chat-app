import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsers,
  getMessagesById,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessagesById);

router.post("/send/:id", protectRoute, sendMessage);
export default router;
