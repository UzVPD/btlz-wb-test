import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),
    POSTGRES_HOST: z.union([z.undefined(), z.string()]),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),

    WILDBERRIES_API_KEY: z.string({
        required_error: "WILDBERRIES_API_KEY is required for authorization",
    }),
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string({
        required_error: "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is required for Google Sheets integration",
    }),    
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: z.string({
        required_error: "GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL is required for Google Sheets integration",
    }),
    SPREADSHEET_ID: z.string({
        required_error: "SPREADSHEET_ID is required for Google Sheets integration",
    }),

});

const env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    WILDBERRIES_API_KEY: process.env.WILDBERRIES_API_KEY,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
});

export default env;
