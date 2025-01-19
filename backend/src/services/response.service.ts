import { IResponseData } from "@/types/response";

export const sendResponse = (data: IResponseData) => {
  const { res, status, message, data: responseData, error } = data;

  return res.status(status).json({
    status: error ? "error" : "success",
    statusCode: status,
    message: message || (error ? "An error occurred" : "Request successful"),
    data: responseData,
    error: error
      ? typeof error === "string"
        ? error
        : typeof error === "object"
        ? error
        : JSON.stringify(error)
      : undefined,
  });
};
