import { API_RESPONSES } from "@/constants/responses";
import { HTTP_STATUS_CODES } from "@/constants/statusCodes";
import { sendResponse } from "@/services/response.service";
import { createUser, getUserByEmail } from "@/services/user.service";

export const userSignup = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return sendResponse({
        res,
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        message: API_RESPONSES.CONFLICT_RESOURCE,
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
