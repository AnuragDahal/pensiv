import { Router } from "express";
import { handleChat } from "../controllers/chat.controller";
// Assuming optionalAuth is available or we can just make it public. 
// Chat usually doesn't strictly need auth unless we track history per user.
// I'll leave it public for now, or use common middleware if needed for rate limiting later.
// But following the pattern:
// import { optionalAuth } from "../../../middlewares"; 

const router = Router();

// POST /api/chat
router.post("/", handleChat);

export { router as chatRoutes };
