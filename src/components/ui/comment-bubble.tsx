"use client"

import * as React from "react"
import { Heart, Reply, CheckCircle2, AlertCircle, X, Send, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommentThread {
  id: string
  author: {
    name: string
    avatar: string
    initials: string
    role: string
    color: string
  }
  content: string
  timestamp: string
  status: "open" | "resolved" | "archived"
  selectedText: string
  likes: number
  isLiked: boolean
  replies: Array<{
    id: string
    author: {
      name: string
      avatar: string
      initials: string
      role: string
      color: string
    }
    content: string
    timestamp: string
    likes: number
    isLiked: boolean
  }>
}

interface CommentBubbleProps {
  comment: CommentThread
  position: { x: number; y: number }
  onClose: () => void
  onLike: (commentId: string, replyId?: string) => void
  onResolve: (commentId: string) => void
}

export function CommentBubble({ comment, position, onClose, onLike, onResolve }: CommentBubbleProps) {
  const [replyText, setReplyText] = React.useState("")
  const [showReplyInput, setShowReplyInput] = React.useState(false)

  const handleAddReply = () => {
    if (!replyText.trim()) return
    // This would typically add the reply to your state/database
    console.log("Adding reply:", replyText)
    setReplyText("")
    setShowReplyInput(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 border-green-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  return (
    <div
      className="fixed z-50 w-80 max-h-96"
      style={{
        left: Math.min(position.x, window.innerWidth - 320 - 20),
        top: Math.min(position.y, window.innerHeight - 400),
      }}
    >
      <Card className={`shadow-lg ${getStatusColor(comment.status)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback className={`text-xs text-white ${comment.author.color}`}>
                    {comment.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${comment.author.color}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  {getStatusIcon(comment.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{comment.author.role}</span>
                  <span>•</span>
                  <span>{comment.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onResolve(comment.id)}>
                    {comment.status === "resolved" ? "Reopen" : "Resolve"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Selected Text Context */}
          <div className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <span className="font-medium text-yellow-800">Selected text:</span>
            <div className="mt-1 text-yellow-700">{comment.selectedText}</div>
          </div>

          {/* Comment Content */}
          <p className="text-sm leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onLike(comment.id)}>
                <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {comment.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
            {comment.status === "resolved" && (
              <Badge variant="secondary" className="text-xs">
                Resolved
              </Badge>
            )}
          </div>

          {/* Replies */}
          {comment.replies.length > 0 && (
            <ScrollArea className="max-h-32">
              <div className="space-y-3 border-l-2 border-gray-200 pl-4 ml-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                          <AvatarFallback className={`text-xs text-white ${reply.author.color}`}>
                            {reply.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${reply.author.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">{reply.author.name}</span>
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 text-xs"
                            onClick={() => onLike(comment.id, reply.id)}
                          >
                            <Heart className={`h-2 w-2 mr-1 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleAddReply} disabled={!replyText.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowReplyInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
