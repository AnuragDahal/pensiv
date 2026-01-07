import { API_RESPONSES } from "../constants/responses";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";
import { env } from "../config/env";
import { APIError } from "../shared/utils";
import { sendResponse } from "../shared/services/response.service";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../features/auth/services/blocked-token.service";

interface JwtPayload {
  _id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    console.log("[AUTH] Request to:", req.method, req.path);
    console.log("[AUTH] Token present:", !!token);

    if (!token) {
      throw new APIError(
        API_RESPONSES.TOKEN_MISSING,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Check if token is blacklisted
    console.log("[AUTH] Checking token blacklist...");
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      console.log("[AUTH] Token is blacklisted");
      sendResponse({
        res,
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: "Token has been blacklisted. Please login again.",
        error: "TokenBlacklisted",
      });
      return;
    }

    if (!env.ACCESS_TOKEN_SECRET) {
      throw new APIError(
        "Access token secret not configured",
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    console.log("[AUTH] Verifying token...");
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    console.log("[AUTH] Token verified successfully for user:", decoded._id);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendResponse({
        res,
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: API_RESPONSES.TOKEN_EXPIRED,
        error: "TokenExpiredError",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      sendResponse({
        res,
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: API_RESPONSES.UNAUTHORIZED,
        error: API_RESPONSES.TOKEN_INVALID,
      });
      return;
    }

    if (error instanceof APIError) {
      sendResponse({
        res,
        status: error.statusCode,
        message: error.message,
      });
      return;
    }

    sendResponse({
      res,
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: API_RESPONSES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      // No token, but that's okay. Continue as anonymous.
      return next();
    }

    if (env.ACCESS_TOKEN_SECRET) {
      try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
        req.user = decoded;
      } catch (err) {
        // Token invalid/expired? Ignore it and proceed as anonymous
        // or log it if necessary.
      }
    }
    next();
  } catch (error) {
    // If anything fails unexpectedly, just continue as anonymous
    next();
  }
};
