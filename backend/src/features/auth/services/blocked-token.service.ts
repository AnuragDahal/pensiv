import { Types } from "mongoose";
import BlockedToken from "../models/blocked-token.model";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id?: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

/**
 * Add a token to the blocked list
 */
export const addTokenToBlocklist = async (
  token: string,
  tokenType: "access" | "refresh",
  userId: string | Types.ObjectId
): Promise<void> => {
  try {
    // Decode token to get expiry time (without verification since we're blocking it anyway)
    const decoded = jwt.decode(token) as DecodedToken;
    
    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token: cannot decode expiry");
    }

    // Convert exp (seconds since epoch) to Date
    const expiresAt = new Date(decoded.exp * 1000);

    await BlockedToken.create({
      token,
      tokenType,
      userId,
      expiresAt,
    });
  } catch (error) {
    console.error("Error adding token to blocklist:", error);
    throw error;
  }
};

/**
 * Check if a token is blacklisted
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const blockedToken = await BlockedToken.findOne({ token });
    return !!blockedToken;
  } catch (error) {
    console.error("Error checking token blacklist:", error);
    return false;
  }
};

/**
 * Remove expired tokens from the blocklist (manual cleanup if needed)
 * Note: MongoDB TTL index should handle this automatically
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
  try {
    const result = await BlockedToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount || 0;
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return 0;
  }
};

/**
 * Get all blocked tokens for a specific user (for debugging/admin purposes)
 */
export const getUserBlockedTokens = async (
  userId: string | Types.ObjectId
) => {
  try {
    return await BlockedToken.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching user blocked tokens:", error);
    return [];
  }
};

/**
 * Remove all blocked tokens for a user (for admin purposes)
 */
export const removeUserBlockedTokens = async (
  userId: string | Types.ObjectId
): Promise<number> => {
  try {
    const result = await BlockedToken.deleteMany({ userId });
    return result.deletedCount || 0;
  } catch (error) {
    console.error("Error removing user blocked tokens:", error);
    return 0;
  }
};
