import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/services/response.service";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { API_RESPONSES } from "@/constants/responses";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (handler: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      return sendResponse({
        res,
        status: error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: error.message || error,
        message: error.message || API_RESPONSES.INTERNAL_SERVER_ERROR,
      });
    }
  };
};

// Custom error class for API errors
export class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, error?: any) {
    super(message);
    this.statusCode = statusCode;
  }
}
