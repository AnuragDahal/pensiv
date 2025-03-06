import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { APIError, asyncHandler } from "@/helpers/handler";
import {
  generateTokens,
  setCookies,
  validateUserCredentials,
} from "@/helpers/user";
import { sendResponse } from "@/services/response.service";
import { createUser, getUserByEmail } from "@/services/user.service";
import { Request, Response } from "express";

export const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new APIError(
      API_RESPONSES.USER_ALREADY_EXISTS,
      HTTP_STATUS_CODES.CONFLICT
    );
  }

  const user = await createUser(req.body);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.CREATED,
    data: user,
    message: API_RESPONSES.USER_CREATED,
  });
});

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await validateUserCredentials(email, password);

  const { accessToken, refreshToken } = await generateTokens(
    user._id.toString()
  );

  setCookies(res, accessToken, refreshToken);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    data: { accessToken, refreshToken },
    message: API_RESPONSES.USER_LOGGED_IN,
  });
});
