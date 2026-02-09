import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'mysql',
    out: './drizzle',
    schema: './src/db/schema.ts',
    dbCredentials: {
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!
    }
})