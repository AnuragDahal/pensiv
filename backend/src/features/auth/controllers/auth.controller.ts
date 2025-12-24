import { API_RESPONSES } from "../../../constants/responses";
import { HTTP_STATUS_CODES } from "../../../constants/statusCodes";
import { sendResponse } from "../../../shared/services/response.service";
import { APIError, asyncHandler } from "../../../shared/utils";
import {
  generateTokens,
  setCookies,
  validateUserCredentials,
} from "../../../shared/utils/auth";
import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByRefreshToken,
  validateRefreshToken,
  removeRefreshToken,
} from "../services/auth.service";



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

    const newTokens = await generateTokens(user._id.toString());
    if (!newTokens) {
      throw new APIError(
        API_RESPONSES.RESOURCE_CREATION_FAILED,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    setCookies(res, newTokens.accessToken, newTokens.refreshToken);

    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.OK,
      data: newTokens.accessToken,
      message: API_RESPONSES.RESOURCE_ACCEPTED,
    });
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new APIError(
      API_RESPONSES.TOKEN_MISSING,
      HTTP_STATUS_CODES.BAD_REQUEST
    );
  }
  const user = await getUserById(req.user._id.toString()).select(
    "-password -createdAt -updatedAt -__v -refreshToken"
  );
  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    data: user,
    message: API_RESPONSES.USER_FETCHED,
  });
});

export const userLogout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?._id) {
    await removeRefreshToken(req.user._id);
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  return sendResponse({
    res,
    status: HTTP_STATUS_CODES.OK,
    data: {},
    message: "Logged out successfully",
  });
});
