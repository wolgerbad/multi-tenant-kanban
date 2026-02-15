"use client"

import "@/helpers/socket";

export default function SocketProvider({children}: {children: React.ReactNode}) {
    return <>
    {children}
    </>
}