import express from 'express';
import type { Request, Response } from 'express';
import { router as auth_router } from './routes/auth.js';
import { error_handler } from './middleware/error.js';
import cors from 'cors';
import { router as user_router } from './routes/user.js';
import { router as organization_router } from './routes/organization.js';
import { router as board_router } from './routes/board.js';
import { router as column_router } from './routes/column.js';
import { router as card_router } from './routes/card.js';
import { router as organization_member_router } from './routes/organization_member.js';
import { router as organization_invite_router } from './routes/organization_invite.js';
import { router as upload_router } from './routes/upload.js';
import { env } from './utils/envSchema.js';

export const app = express();

app.use(express.json());
app.use(cors({ origin: env.APP_URL, credentials: true }));

app.use('/auth', auth_router);
app.use('/user', user_router);
app.use('/organization', organization_router);
app.use('/board', board_router);
app.use('/column', column_router);
app.use('/card', card_router);
app.use('/organization-member', organization_member_router);
app.use('/organization-invite', organization_invite_router);
app.use('/upload', upload_router);
app.use(error_handler);

app.get('/health', (req: Request, res: Response) => {
    res.send('success')
})


