import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { APIError, asyncHandler } from "@/shared/utils";
import {
  generateTokens,
  generateNewAccessToken,
  setCookies,
  validateUserCredentials,
} from "@/shared/utils/auth";
import { sendResponse } from "@/shared/services/response.service";
import {
  createUser,
  getRefreshToken,
  getUserByEmail,
  getUserByRefreshToken,
  validateRefreshToken,
} from "../services/auth.service";
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

export const accessTokenRefresh = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new APIError(
        API_RESPONSES.TOKEN_MISSING,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    const isValidRefreshToken = await validateRefreshToken(refreshToken);
    if (!isValidRefreshToken) {
      throw new APIError(
        API_RESPONSES.TOKEN_INVALID,
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
      throw new APIError(
        API_RESPONSES.TOKEN_EXPIRED,
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }

    const newToken = await generateNewAccessToken(user._id.toString());
    if (!newToken) {
      throw new APIError(
        API_RESPONSES.RESOURCE_CREATION_FAILED,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    // Only set the access token cookie, keep the existing refresh token
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: 10 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", newToken.accessToken, options);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      data: newToken.accessToken,
      message: API_RESPONSES.RESOURCE_ACCEPTED,
    });
  }
);
