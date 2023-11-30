import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import React from "react"

interface ServerIdPageProps {
  params: {
    serverId: string
  }
}

async function page({ params }: ServerIdPageProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      Members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      Channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = server?.Channels[0]

  if (initialChannel?.name !== "general") {
    return null
  }
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default page
