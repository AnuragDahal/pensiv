import { Request, Response } from "express";
import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { sendResponse } from "../../../shared/services/response.service";
import { APIError, asyncHandler } from "../../../shared/utils";
import { chatWithBlog } from "../services/chat.service";

export const handleChat = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim() === "") {
    throw new APIError(
      API_RESPONSES.BAD_REQUEST,
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }

  const result = await chatWithBlog(query.trim());

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    message: "Chat response generated successfully",
    data: result,
  });
});
