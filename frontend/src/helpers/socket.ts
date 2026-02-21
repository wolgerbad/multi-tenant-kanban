import { env } from "@/utils/envSchema"
import { io } from "socket.io-client"

export const socket = io(`${env.SERVER_URL}`, {
    autoConnect: true,
    withCredentials: true
})