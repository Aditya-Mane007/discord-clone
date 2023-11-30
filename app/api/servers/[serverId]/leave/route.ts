import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params?.id) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params?.id,
        profileId: {
          not: profile.id
        },
        Members: {
          some: {
            profileId: profile.id
          }
        }
      },
      data: {
        Members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
