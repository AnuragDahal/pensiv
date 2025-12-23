import { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
    origin : [env.FRONTEND_URL,"http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true, // This is important for cookies
    maxAge: 86400, // 24 hours
}