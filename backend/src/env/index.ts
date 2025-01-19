import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  GMAIL_USER: z.string(),
  GMAIL_PASS: z.string(),
  IMAGEKIT_PUBLIC_KEY: z.string(),
  IMAGEKIT_PRIVATE_KEY: z.string(),
  IMAGEKIT_URL_ENDPOINT: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  FRONTEND_URL: z.string(),
});

const env = envSchema.parse(process.env);
export { env };
