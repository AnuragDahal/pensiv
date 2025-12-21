import { NextFunction, Request, Response as ExpressResponse } from "express";
import { API_RESPONSES } from "../../constants/responses";
import { HTTP_STATUS_CODES } from "../../constants/statusCodes";
import { sendResponse } from "../services/response.service";

type AsyncFunction = (
  req: Request,
  res: ExpressResponse,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (handler: AsyncFunction) => {
  return async (req: Request, res: ExpressResponse, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string; [key: string]: unknown };
      sendResponse({
        res,
        status: err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: err.message || err,
        message: err.message || API_RESPONSES.INTERNAL_SERVER_ERROR,
      });
    }
  };
};

// Custom error class for API errors
export class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
