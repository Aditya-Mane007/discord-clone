"use client"

import qs from "query-string"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

function DeleteChannelModal() {
  const { onOpen, isOpen, onClose, type, data } = useModal()

  const router = useRouter()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)

  const { server, channel } = data

  const isModalOpen = isOpen && type === "deleteChannel"

  const onLeave = async () => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })
      await axios.delete(url)
      onClose()
      router.refresh()
      router.push(`/servers/${server?.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to this?{" "}
            <span className="font-semibold text-indigo-500">
              #{channel?.name} will be permanently deleted
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-grey-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              variant="ghost"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onLeave}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModal
