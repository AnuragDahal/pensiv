import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { env } from "@/env";
import { sendResponse } from "@/services/response.service";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.UNAUTHORIZED,
      message: API_RESPONSES.UNAUTHORIZED,
    });
  }
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.UNAUTHORIZED,
      message: API_RESPONSES.UNAUTHORIZED,
    });
  }
};
