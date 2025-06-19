import { IResponseData } from "../../types/response";

export const sendResponse = (data: IResponseData) => {
  const { res, status, message, data: responseData, error } = data;
  const isError = status >= 400;
  return res.status(status).json({
    status: isError ? "error" : "success",
    statusCode: status,
    message: message || (isError ? "An error occurred" : "Request successful"),
    data: isError ? undefined : responseData,
    error: error
      ? typeof error === "string"
        ? error
        : typeof error === "object"
        ? error
        : JSON.stringify(error)
      : undefined,
  });
};
