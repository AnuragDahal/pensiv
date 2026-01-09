import rateLimit from "express-rate-limit";
import { HTTP_STATUS_CODES } from "../../constants/statusCodes";

/**
 * Rate limiter for chat endpoint
 * - 10 requests per minute for unauthenticated users (by IP)
 * - Helps prevent abuse of the AI chat feature
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    status: "error",
    statusCode: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    message: "Too many requests. Please try again in a minute.",
  },

});

/**
 * Stricter rate limiter for guest users (no auth token)
 * - 5 requests per minute
 */
export const guestChatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // 5 requests per window for guests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    statusCode: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    message: "Too many requests. Please sign in for higher limits or try again later.",
  },

  skip: (req) => {
    // Skip this limiter if user has auth token (they'll use the regular limiter)
    const authHeader = req.headers.authorization;
    return !!authHeader && authHeader.startsWith("Bearer ");
  },
});

/**
 * General API rate limiter (can be applied globally)
 * - 100 requests per minute
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    statusCode: HTTP_STATUS_CODES.TOO_MANY_REQUESTS,
    message: "Too many requests. Please slow down.",
  },
});
