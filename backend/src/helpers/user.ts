import { API_RESPONSES } from "@/constants/responses";
import {
  generateAccessAndRefreshToken,
  getUserByEmail,
} from "@/services/user.service";

export const validateUserCredentials = async (
  email: string,
  password: string
) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error(API_RESPONSES.USER_NOT_FOUND);
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new Error(API_RESPONSES.UNAUTHORIZED);
  }
  return user;
};

export const generateTokens = async (userId: string) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userId
  );
  if (!accessToken || !refreshToken) {
    throw new Error(API_RESPONSES.RESOURCE_CREATION_FAILED);
  }
  return { accessToken, refreshToken };
};

export const setCookies = (
  res: any,
  accessToken: string,
  refreshToken: string
) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 10 * 60 * 60 * 1000,
  };
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
};
