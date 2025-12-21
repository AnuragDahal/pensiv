import { API_RESPONSES } from "../constants/responses";
import { HTTP_STATUS_CODES } from "../constants/statusCodes";
import { env } from "../config/env";
import { APIError } from "../shared/utils";
import { sendResponse } from "../shared/services/response.service";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new APIError(
        API_RESPONSES.TOKEN_MISSING,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    if (!env.ACCESS_TOKEN_SECRET) {
      throw new APIError(
        "Access token secret not configured",
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      sendResponse({
        res,
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: API_RESPONSES.UNAUTHORIZED,
        error: API_RESPONSES.TOKEN_INVALID,
      });
    }

    if (error instanceof APIError) {
      sendResponse({
        res,
        status: error.statusCode,
        message: error.message,
      });
    }

    sendResponse({
      res,
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: API_RESPONSES.INTERNAL_SERVER_ERROR,
    });
  }
};
