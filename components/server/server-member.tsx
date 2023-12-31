"use client"
import { cn } from "@/lib/utils"
import {
  $Enums,
  Channel,
  ChannelType,
  Member,
  MemberRole,
  Profile,
  Server
} from "@prisma/client"
import {
  Edit,
  Hash,
  Lock,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Trash,
  Video
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { ActionTooltip } from "../navigation/action-tooltip"
import UserAvatar from "../user-avatar"

interface ServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}

const iconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500 ml-2 " />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 text-indigo-500 ml-2 " />
  ),
  [MemberRole.GUEST]: null
}

function ServerMember({ member, server }: ServerMemberProps) {
  const router = useRouter()
  const params = useParams()

  const icon = iconMap[member.role]

  return (
    <button
      onClick={() =>
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
      }
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="w-8 h-8  md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}

export default ServerMember
