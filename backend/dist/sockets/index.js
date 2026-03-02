import { createServer } from 'node:http';
import { app } from '../server.js';
import { Server } from 'socket.io';
import { jwtVerify } from 'jose';
import { env } from '../utils/envSchema.js';
import { parseCookie } from 'cookie';
import { user_repository } from '../repository/user.repository.js';
import { organization_member_repository } from '../repository/organization_member.repository.js';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
const SECRET = new TextEncoder().encode(env.JWT_SECRET);
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: env.APP_URL, credentials: true },
});
export const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
io.use(async (socket, next) => {
    console.log('hey, hi');
    const cookies = socket.handshake.headers.cookie;
    // Allow connection even without cookies; JWT extraction is optional
    if (!cookies)
        return next();
    const parsed = parseCookie(cookies);
    const jwt = parsed?.jwt;
    if (!jwt)
        return next();
    try {
        const verify = await jwtVerify(jwt, SECRET);
        socket.data.user_id = verify?.payload?.id;
    }
    catch (error) {
        // Invalid JWT is allowed; connection proceeds as unauthenticated
        console.log('JWT verification failed:', error);
    }
    next();
});
io.on('connection', async (socket) => {
    console.log('uh');
    const user_id = socket.data.user_id;
    // Allow connection even if unauthenticated, but only authenticated users get joined to rooms
    if (!user_id) {
        console.log('Unauthenticated socket connection');
        return;
    }
    try {
        const [user] = await user_repository.get_user_by_id(user_id);
        if (!user)
            return;
        socket.join(`user-${user.id}`);
        const organization_ids = await organization_member_repository.get_organization_ids_of_member(user.id);
        organization_ids.map((org_id) => socket.join(`organization-${org_id}`));
        console.log('user', user);
        socket.on('board_create', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('board_new');
        });
        socket.on('column_created', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('column_new');
        });
        socket.on('card_created', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('card_new');
        });
        socket.on('dragndrop_event', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('dragndrop_new');
        });
        socket.on('invite_send', (receiver_id) => {
            socket.to(`user-${receiver_id}`).emit('invite_new');
        });
        socket.on('invite_answer', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('invite_answer_new');
        });
        socket.on('card_updated', (organization_id) => {
            console.log('card_updated');
            socket.to(`organization-${organization_id}`).emit('card_update_new');
        });
        socket.on('column_updated', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('column_update_new');
        });
        socket.on('column_deleted', (organization_id) => {
            socket.to(`organization-${organization_id}`).emit('column_delete_new');
        });
    }
    catch (error) {
        console.error('Error in socket connection handler:', error);
    }
});
server.listen(process.env.PORT || 8000, () => {
    console.log('server running');
});
