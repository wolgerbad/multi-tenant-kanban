import { clientEnv } from "@/utils/envSchema"
import { io } from "socket.io-client"

export const socket = io(clientEnv.NEXT_PUBLIC_SERVER_URL, {
    autoConnect: true,
    withCredentials: true
})