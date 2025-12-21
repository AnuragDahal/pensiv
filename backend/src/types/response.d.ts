import { Response as ExpressResponse } from "express";

export interface IResponseData {
  res: ExpressResponse;
  status: number;
  data?: unknown;
  message?: string;
  error?: string | object;
}
