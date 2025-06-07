export const API_RESPONSES = {
  // 2xx Success - User Creation
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_FETCHED: "User details fetched successfully",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  USER_VERIFIED: "User verified successfully",
  USER_LOGGED_IN: "User logged in successfully",
  USER_LOGGED_OUT: "User logged out successfully",
  USER_PASSWORD_RESET: "Password reset successful",
  USER_PASSWORD_CHANGED: "Password changed successfully",
  USER_PROFILE_UPDATED: "User profile updated successfully",
  USER_EMAIL_UPDATED: "User email updated successfully",
  USER_EMAIL_VERIFIED: "User email verified successfully",
  USER_EMAIL_RESENT: "Email verification resent successfully",
  USER_OTP_SENT: "OTP sent successfully",
  USER_OTP_VERIFIED: "OTP verified successfully",
  USER_LOGIN_FAILED: "Login failed, check your credentials",
  USER_OTP_RESENT: "OTP resent successfully",

  // Authentication and Authorization
  AUTHENTICATION_FAILED: "Authentication failed, check your credentials",
  TOKEN_EXPIRED: "Token expired, please log in again",
  TOKEN_INVALID: "Invalid token, please log in again",
  HEADER_MISSING: "Authorization header missing",
  TOKEN_MISSING: "Token missing in the request",

  // 2xx Success - General Resource Creation
  RESOURCE_ACCEPTED: "Resource accepted successfully",
  RESOURCE_CREATED: "Resource created successfully",
  RESOURCE_UPDATED: "Resource updated successfully",
  RESOURCE_DELETED: "Resource deleted successfully",
  RESOURCE_FETCHED: "Resource fetched successfully",
  RESOURCE_PARTIAL_FETCH: "Partial resource data delivered successfully",

  // 4xx Client Errors - User Creation
  BAD_REQUEST: "Bad request, check your input",
  USER_CREATION_FAILED: "Failed to create user, invalid data",
  USER_UPDATE_FAILED: "Failed to update user, invalid data",
  USER_DELETION_FAILED: "Failed to delete user",
  UNAUTHORIZED: "Unauthorized access, please log in",
  FORBIDDEN: "Forbidden access, you don't have permission",
  NOT_FOUND: "User not found",
  CONFLICT: "Conflict, user already exists",
  UNPROCESSABLE_ENTITY: "Invalid user data, please correct it",

  // 4xx Client Errors - General Resource Creation
  RESOURCE_CREATION_FAILED: "Failed to create resource, invalid data",
  RESOURCE_UPDATE_FAILED: "Failed to update resource",
  RESOURCE_DELETION_FAILED: "Failed to delete resource",
  METHOD_NOT_ALLOWED: "Method not allowed for this resource",
  RESOURCE_NOT_FOUND: "Resource not found",
  CONFLICT_RESOURCE: "Resource conflict, already exists",
  INVALID_RESOURCE_DATA: "Invalid resource data, check input",

  // 5xx Server Errors - User Creation
  INTERNAL_SERVER_ERROR: "Internal server error, please try again later",
  USER_CREATION_SERVER_ERROR: "Server error during user creation",
  USER_UPDATE_SERVER_ERROR: "Server error during user update",
  USER_DELETION_SERVER_ERROR: "Server error during user deletion",

  // 5xx Server Errors - General Resource Creation
  RESOURCE_CREATION_SERVER_ERROR: "Server error during resource creation",
  RESOURCE_UPDATE_SERVER_ERROR: "Server error during resource update",
  RESOURCE_DELETION_SERVER_ERROR: "Server error during resource deletion",
  SERVICE_UNAVAILABLE: "Service unavailable, please try again later",
  GATEWAY_TIMEOUT: "Gateway timeout, please try again later",
  NOT_IMPLEMENTED: "Feature not implemented, coming soon",
  BAD_GATEWAY: "Bad gateway, please try again",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP version not supported",
  NETWORK_AUTHENTICATION_REQUIRED: "Network authentication required",

  // 4xx Common Errors
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  REQUEST_TIMEOUT: "Request timed out, please try again",
  PAYLOAD_TOO_LARGE: "Payload too large, please reduce the size",
  URI_TOO_LONG: "URI is too long",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported media type",
  EXPECTATION_FAILED: "Expectation failed",
  I_AM_A_TEAPOT: "I'm a teapot (teapot error)", // Fun but rare!

  // 5xx Common Errors
  LOOP_DETECTED: "Infinite loop detected",
  INSUFFICIENT_STORAGE: "Insufficient storage to complete the request",
  NOT_EXTENDED: "Request not extended, more details needed",
};
