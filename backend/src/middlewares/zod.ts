import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { sendResponse } from "@/shared/services/response.service";
import { NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const zodValidator = (schema: ZodSchema) => {
  return (req: any, res: any, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]; // Get the first error
        const formattedError = {
          field: firstError.path.join("."), 
          message: firstError.message,
        };
        return sendResponse({
          res,
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          error: formattedError,
          message: firstError.message,
        });
      }
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: error as string,
        message: API_RESPONSES.INTERNAL_SERVER_ERROR,
      });
    }
  };
};
