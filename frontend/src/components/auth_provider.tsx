"use client"

import { getSession } from "@/helpers/session"
import { User } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<null | User>(null)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<null | User >(null)

    useEffect(function() {
        async function session() {
           const session = await getSession()
           if(session.ok) setUser(session.data)
        }
        session()
    }, [])

    return <AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error('Not allowed to have access for useAuth')
    return context
}