"use client"

import * as React from "react"
import { useGame } from "@/context/gameContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const roleName = (r: string) => {
  if(r==="w") return "White"
  if(r==="b") return "Black"
  return r
}

export default function GameChat() {
  const { chatMessages, sendChatMessage } = useGame()
  const [text, setText] = React.useState("")

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    sendChatMessage(text.trim())
    setText("")
  }

  return (
    <div className="w-full h-40">
      {/* Messages */}
      <ScrollArea className="h-full  w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium">Chat</h4>

          {chatMessages.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No messages yet
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <React.Fragment key={i}>
              <div className="text-sm">
                <span className="mr-2 text-xs text-muted-foreground">
                  {roleName(msg.sender)}
                </span>
                {msg.message}
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={send} className="mt-2 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          maxLength={500}
        />
        <Button type="submit" size="icon" disabled={!text.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
}
