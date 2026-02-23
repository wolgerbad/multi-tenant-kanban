import { createServer } from 'node:http';
import { app } from '../server.js';
import { Server, Socket } from 'socket.io';
import { jwtVerify } from 'jose';
import { env } from '../utils/envSchema.js';
import { parseCookie } from 'cookie';
import { user_repository } from '../repository/user.repository.js';
import { organization_member_repository } from '../repository/organization_member.repository.js';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { NextFunction } from 'express';


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

io.use(async (socket: Socket, next: NextFunction) => {
  console.log('hey, hi');
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) return next(new Error('no cookie found.'));

  const parsed = parseCookie(cookies);
  const jwt = parsed?.jwt;
  
  if(!jwt) return next();

  const verify = await jwtVerify(jwt, SECRET);
  socket.data.user_id = verify?.payload?.id;
  next();
});

io.on('connection', async (socket: Socket) => {
  console.log('uh');
  const user_id = socket.data.user_id;
  if(!user_id) return;
  const [user] = await user_repository.get_user_by_id(user_id);
  socket.join(`user-${user.id}`);
  const organization_ids =
    await organization_member_repository.get_organization_ids_of_member(
      user.id
    );

  organization_ids.map((org_id: number) => socket.join(`organization-${org_id}`));

  if (!user) return;
  console.log('user', user);

  socket.on('board_create', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('board_new');
  });

  socket.on('column_created', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('column_new');
  });

  socket.on('card_created', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('card_new');
  });

  socket.on('dragndrop_event', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('dragndrop_new');
  });

  socket.on('invite_send', (receiver_id: number) => {
    socket.to(`user-${receiver_id}`).emit('invite_new');
  });

  socket.on('invite_answer', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('invite_answer_new');
  });

  socket.on('card_updated', (organization_id: number) => {
    console.log('card_updated');
    socket.to(`organization-${organization_id}`).emit('card_update_new');
  });

  socket.on('column_updated', (organization_id: number) => {
    socket.to(`organization-${organization_id}`).emit('column_update_new');
  });
});

server.listen(8000, () => {
  console.log('server running');
});
