"use client"

import * as React from "react"
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Reply,
  Heart,
  AlertCircle,
  CheckCircle2,
  Search,
  Pin,
  Archive,
  Trash2,
  Edit3,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Comment {
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
  position: { start: number; end: number }
  likes: number
  isLiked: boolean
  isPinned: boolean
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

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "",
      initials: "SC",
      role: "Product Designer",
      color: "bg-blue-500",
    },
    content:
      "This section needs more detail about the user research findings. We should include specific metrics and user feedback to strengthen our argument.",
    timestamp: "2 hours ago",
    status: "open",
    selectedText: "Content writers across multiple domains frequently struggle",
    position: { start: 20, end: 80 },
    likes: 3,
    isLiked: false,
    isPinned: true,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Mike Johnson",
          avatar: "",
          initials: "MJ",
          role: "UX Researcher",
          color: "bg-green-500",
        },
        content: "I can provide the survey data from last month. We had 247 responses with some great insights.",
        timestamp: "1 hour ago",
        likes: 1,
        isLiked: true,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Emma Davis",
      avatar: "",
      initials: "ED",
      role: "Content Strategist",
      color: "bg-purple-500",
    },
    content:
      "Great insights! Can we add some metrics to support this? Maybe include the 40% productivity loss statistic we found in our research.",
    timestamp: "1 hour ago",
    status: "resolved",
    selectedText: "significantly impact productivity, quality, and collaboration effectiveness",
    position: { start: 150, end: 220 },
    likes: 5,
    isLiked: true,
    isPinned: false,
    replies: [
      {
        id: "2-1",
        author: {
          name: "Alex Kim",
          avatar: "",
          initials: "AK",
          role: "Data Analyst",
          color: "bg-orange-500",
        },
        content: "I've added the metrics to the document. The 40% stat is now included with proper citations.",
        timestamp: "30 minutes ago",
        likes: 2,
        isLiked: false,
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "David Wilson",
      avatar: "",
      initials: "DW",
      role: "Product Manager",
      color: "bg-red-500",
    },
    content:
      "Should we consider adding a section about competitive analysis here? It would help contextualize our solution.",
    timestamp: "45 minutes ago",
    status: "open",
    selectedText: "Solution Overview",
    position: { start: 300, end: 320 },
    likes: 1,
    isLiked: false,
    isPinned: false,
    replies: [],
  },
]

export function CommentsPanel() {
  const [comments, setComments] = React.useState<Comment[]>(mockComments)
  const [filter, setFilter] = React.useState<"all" | "open" | "resolved">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState("")

  const filteredComments = comments.filter((comment) => {
    const matchesFilter = filter === "all" || comment.status === filter
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleLikeComment = (commentId: string, replyId?: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (replyId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                  : reply,
              ),
            }
          } else {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          }
        }
        return comment
      }),
    )
  }

  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, status: comment.status === "resolved" ? "open" : "resolved" }
          : comment,
      ),
    )
  }

  const handlePinComment = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, isPinned: !comment.isPinned } : comment)),
    )
  }

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return

    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: "You",
        avatar: "",
        initials: "YU",
        role: "Team Member",
        color: "bg-gray-500",
      },
      content: replyText,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment,
      ),
    )

    setReplyText("")
    setReplyingTo(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "archived":
        return <Archive className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 border-green-200"
      case "archived":
        return "bg-gray-50 border-gray-200"
      default:
        return "bg-orange-50 border-orange-200"
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background border-l">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold">Comments</h2>
              <Badge variant="secondary" className="text-xs">
                {comments.filter((c) => c.status === "open").length}
              </Badge>
            </div>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className="h-7 px-2 text-xs"
              >
                All ({comments.length})
              </Button>
              <Button
                variant={filter === "open" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("open")}
                className="h-7 px-2 text-xs"
              >
                Open ({comments.filter((c) => c.status === "open").length})
              </Button>
              <Button
                variant={filter === "resolved" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("resolved")}
                className="h-7 px-2 text-xs"
              >
                Resolved ({comments.filter((c) => c.status === "resolved").length})
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredComments
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
              .map((comment) => (
                <Card key={comment.id} className={`relative ${getStatusColor(comment.status)}`}>
                  {comment.isPinned && (
                    <div className="absolute -top-1 -right-1">
                      <Pin className="h-3 w-3 text-blue-500 fill-blue-500" />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar || ""} alt={comment.author.name} />
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

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePinComment(comment.id)}>
                            <Pin className="h-4 w-4 mr-2" />
                            {comment.isPinned ? "Unpin" : "Pin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResolveComment(comment.id)}>
                            {comment.status === "resolved" ? (
                              <>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Reopen
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Resolve
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                          {comment.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="space-y-3 border-l-2 border-gray-200 pl-4 ml-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="relative">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={reply.author.avatar || ""}
                                    alt={reply.author.name}
                                  />
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
                                    onClick={() => handleLikeComment(comment.id, reply.id)}
                                  >
                                    <Heart
                                      className={`h-2 w-2 mr-1 ${reply.isLiked ? "fill-red-500 text-red-500" : ""}`}
                                    />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-2">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!replyText.trim()}>
                            Reply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

            {filteredComments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No comments found</p>
                <p className="text-xs">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <span>{comments.length} comments</span>
            </div>
            <div className="flex items-center gap-1">
              {mockComments.slice(0, 3).map((comment, index) => (
                <div
                  key={comment.id}
                  className={`w-4 h-4 rounded-full border border-white ${comment.author.color}`}
                  style={{ marginLeft: index > 0 ? "-4px" : "0" }}
                />
              ))}
              {mockComments.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-gray-300 border border-white flex items-center justify-center text-[8px] text-gray-600 ml-[-4px]">
                  +{mockComments.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
