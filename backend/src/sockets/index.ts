import { createServer } from "node:http";
import { app } from "../server.js";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import { env } from "../utils/envSchema.js";
import { parseCookie } from "cookie";
import { user_repository } from "../repository/user.repository.js";
import { organization_repository } from "../repository/organization.repository.js";
import { organization_member_repository } from "../repository/organization_member.repository.js";


const SECRET = new TextEncoder().encode(env.JWT_SECRET)

const server = createServer(app)
const io = new Server(server, { cors: { origin: 'http://localhost:3000', credentials: true } })

io.use(async (socket, next) => {
    console.log("hey, hi")
    const cookies = socket.handshake.headers.cookie
    if(!cookies) return next(new Error('no cookie found.'))

    const parsed = parseCookie(cookies)
    const jwt = parsed?.jwt as string 

    const verify = await jwtVerify(jwt, SECRET)
    socket.data.user_id = verify?.payload?.id
    next()
})

io.on('connection', async (socket) => {
    console.log("uh")
    const user_id = socket.data.user_id
    const [user] = await user_repository.get_user_by_id(user_id);
    const organization_ids = await organization_member_repository.get_organization_ids_of_member(user.id)

    organization_ids.map(org_id => socket.join(`organization-${org_id}`))

    
    if(!user) return;
    console.log("user", user)

    socket.on('board_create', (organization_id) => {
        socket.to(`organization-${organization_id}`).emit('board_new')
    })

    socket.on('column_created', async (organization_id) => {
        socket.to(`organization-${organization_id}`).emit('column_new') 
    })
})

server.listen(8000, () => {
    console.log('server running')
})