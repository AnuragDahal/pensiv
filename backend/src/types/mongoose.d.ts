/**
 * Type declarations to fix the Mongoose types error
 */
declare module "mongoose" {
  // This extends the types to resolve compatibility issues with Subdocument
  namespace Types {
    interface ObjectIdToString<T> {
      [key: string]: any;
    }
  }
}

export {};
