import { Router } from "express";
import { handleChat } from "../controllers/chat.controller";
import { chatRateLimiter, guestChatRateLimiter } from "../../../shared/middlewares";

const router = Router();

// POST /api/chat
// Apply both rate limiters:
// - guestChatRateLimiter: 5 req/min for guests (skipped if authenticated)
// - chatRateLimiter: 10 req/min for all users
router.post("/", guestChatRateLimiter, chatRateLimiter, handleChat);

export { router as chatRoutes };
