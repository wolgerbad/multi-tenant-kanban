"use client"

import "@/helpers/socket";
import { socket } from "@/helpers/socket";
import { useEffect } from "react";

export default function SocketProvider({children}: {children: React.ReactNode}) {
    useEffect(function() {
        socket.on('connect', () => {
            console.log('socket connected')
        })
    }, [])
    useEffect(function() {
        socket.on('connect_error', () => {
            console.log('socket rejected')
        })
    }, [])

    return <>
    {children}
    </>
}