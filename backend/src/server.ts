import express from "express";
import type { Request, Response } from "express";
import { router as auth_router } from "./router/auth.js";
import { error_handler } from "./middleware/error.js";


export const app = express();

app.use(error_handler)
app.use(express.json())

app.use('/auth', auth_router)

app.get('/', (req: Request, res: Response) => {
    console.log('hi')
}) 