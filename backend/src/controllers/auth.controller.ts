import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import {
  generateTokens,
  setCookies,
  validateUserCredentials,
} from "@/helpers/user";
import { sendResponse } from "@/services/response.service";
import { createUser, getUserByEmail } from "@/services/user.service";

export const userSignup = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.CONFLICT,
        message: API_RESPONSES.USER_ALREADY_EXISTS,
      });
    const user = await createUser(req.body);
    return sendResponse({
      res,
      status: HTTP_STATUS_CODES.CREATED,
      data: user,
      message: API_RESPONSES.USER_CREATED,
    });
  } catch (error) {
    if (error)
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error: error,
        message: API_RESPONSES.USER_CREATION_FAILED,
      });
  }
};

export const userLogin = async (req: any, res: any) => {
  try {
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
  } catch (error: any) {
    const status =
      error.message === API_RESPONSES.USER_NOT_FOUND ||
      error.message === API_RESPONSES.UNAUTHORIZED
        ? HTTP_STATUS_CODES.UNAUTHORIZED
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    return sendResponse({
      res,
      status,
      error: error.message,
      message: error.message,
    });
  }
};
