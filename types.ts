import { Server as NextServer } from "http"
import { NextApiResponse } from "next"
import { Server as SoketIOServer } from "socket.io"

import { Member, Profile, Server } from "@prisma/client"
import { Socket } from "dgram"

export type ServerWithMembersWithProfiles = Server & {
  Members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NextServer & {
      io: SoketIOServer
    }
  }
}
