import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { role } = await req.json()

    const serverId = searchParams.get("serverId")

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params.memberId) {
      return new NextResponse("Member Id Missing", { status: 400 })
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    const member = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        Members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        Members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.log("[MEMBER_ID_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const serverId = searchParams.get("serverId")

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    if (!params.memberId) {
      return new NextResponse("Member Id Missing", { status: 400 })
    }

    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 })
    }

    const member = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        Members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        Members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
