import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface InviteCodePageProps {
  params: {
    id: string
  }
}

async function page({ params }: InviteCodePageProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  if (!params.id) {
    return redirect("/")
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.id,
      Members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.id
    },
    data: {
      Members: {
        create: [
          {
            profileId: profile.id
          }
        ]
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }
  return null
}

export default page
