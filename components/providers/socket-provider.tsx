"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io as clientIO } from "socket.io-client"

type SoketContextType = {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SoketContextType>({
  socket: null,
  isConnected: false
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSoket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = new (clientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false
      }
    )

    socketInstance.on("connect", () => {
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    setSoket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
