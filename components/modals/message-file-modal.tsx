"use client"

import axios from "axios"
import qs from "query-string"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import UploadButton from "../uploadButton"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"

function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal()

  const { apiUrl, query } = data
  const router = useRouter()

  const isModalOpen = isOpen && type === "messageFile"

  const formSchema = z.object({
    fileUrl: z.string().min(1, {
      message: "Attachment is required"
    })
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query
    })
    try {
      await axios.post(url, {
        ...values,
        content: values.fileUrl
      })

      form.reset()
      router.refresh()
      handleClose()
      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  function handleClose() {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadButton
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal
