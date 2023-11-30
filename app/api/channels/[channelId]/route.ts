import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { Stringifiable } from "query-string"

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get("serverId")

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params.channelId) {
      return new NextResponse("Channel Id Missing", { status: 400 })
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        Members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        Channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general"
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { name, type } = await req.json()
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get("serverId")

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params.channelId) {
      return new NextResponse("Channel Id Missing", { status: 400 })
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        Members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        Channels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: "general"
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
