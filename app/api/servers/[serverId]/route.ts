import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  {
    params
  }: {
    params: {
      serverId: string
    }
  }
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Not Authrorized", { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse("Server Id Nissing", { status: 404 })
    }

    const server = await db.server.delete({
      where: {
        id: params?.serverId,
        profileId: profile.id
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      serverId: string
    }
  }
) {
  try {
    const { name, imageUrl } = await req.json()

    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data: {
        name,
        imageUrl
      }
    })

    if (server) {
      return NextResponse.json(server)
    }
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
