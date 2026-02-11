import express from "express";
import type { Request, Response } from "express";
import { router as auth_router } from "./routes/auth.js";
import { error_handler } from "./middleware/error.js";
import cors from "cors"
import { router as user_router } from "./routes/user.js";
import { router as organization_router } from "./routes/organization.js";
import { router as board_router } from "./routes/board.js";

export const app = express();

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

app.use('/auth', auth_router)
app.use('/user', user_router)
app.use('/organization', organization_router)
app.use('/board', board_router)
app.use(error_handler)

app.get('/', (req: Request, res: Response) => {
    console.log('hi')
})