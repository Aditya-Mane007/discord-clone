import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input"
import ChatMessages from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room"
import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"
import React from "react"

interface ChannelIdProps {
  params: {
    serverId: string
    channelId: string
  }
}

async function page({ params }: ChannelIdProps) {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) {
    redirect("/")
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            name={channel.name}
            type="channel"
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={true} video={true} />
      )}
    </div>
  )
}

export default page
