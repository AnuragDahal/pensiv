export interface IResponseData {
  res: any;
  status: number;
  data?: any;
  message?: string;
  error?: string | object;
}
