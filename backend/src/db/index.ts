import dotenv from "dotenv";
dotenv.config()

import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import * as schema from "./schema.js"

const connection = await mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
})

export const db = drizzle(connection, {
    schema,
    logger: true,
    mode: 'default'
})
