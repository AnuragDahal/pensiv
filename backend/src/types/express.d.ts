import { Types } from "mongoose";

// Augment the Express Request interface to include our custom user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string | Types.ObjectId;
        email: string;
        name: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};
