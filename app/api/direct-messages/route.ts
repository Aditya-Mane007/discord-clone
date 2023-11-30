import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { DirectMessage, Message } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Not Authorized", { status: 401 })
    }

    const cursor = searchParams.get("cursor")
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return new NextResponse("conversation Id Missing", { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          conversationId: conversationId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId: conversationId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    })
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}