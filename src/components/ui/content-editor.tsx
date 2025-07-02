"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Save,
  Users,
  MessageSquare,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CommentBubble } from "@/components/ui/comment-bubble"
import { FloatingToolbar } from "./floating-toolbar"

// Mock data for team members
const teamMembers = [
  { id: "1", initials: "SC", color: "bg-blue-500", name: "Sarah Chen" },
  { id: "2", initials: "MJ", color: "bg-green-500", name: "Mike Johnson" },
  { id: "3", initials: "ED", color: "bg-purple-500", name: "Emma Davis" },
  { id: "4", initials: "AK", color: "bg-orange-500", name: "Alex Kim" },
  { id: "5", initials: "DW", color: "bg-red-500", name: "David Wilson" },
]

// Comment highlight interface
interface CommentHighlight {
  id: string
  text: string
  commentId: string
  authors: { initials: string; color: string }[]
  startOffset: number
  endOffset: number
}

const mockComment = {
  id: "1",
  author: {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SC",
    role: "Product Designer",
    color: "bg-blue-500",
  },
  content:
    "This section needs more detail about the user research findings. We should include specific metrics and user feedback to strengthen our argument.",
  timestamp: "2 hours ago",
  status: "open" as const,
  selectedText: "Content writers across multiple domains frequently struggle",
  likes: 3,
  isLiked: false,
  replies: [
    {
      id: "1-1",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
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
}

function CommentPopup({
  selectedText,
  position,
  onAddComment,
  onCancel,
}: {
  selectedText: string
  position: { x: number; y: number }
  onAddComment: (comment: string) => void
  onCancel: () => void
}) {
  const [comment, setComment] = React.useState("")

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(comment)
      setComment("")
    }
  }

  return (
    <Card
      className="absolute z-50 w-80 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Selected text:</span>
            <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">"{selectedText}"</div>
          </div>
          <Textarea
            placeholder="Add your comment or question..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!comment.trim()}>
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Separate overlay component for highlights
function HighlightOverlay({
  highlights,
  contentRef,
  onHighlightClick,
}: {
  highlights: CommentHighlight[]
  contentRef: React.RefObject<HTMLDivElement>
  onHighlightClick: (event: React.MouseEvent, commentId: string) => void
}) {
  const [highlightElements, setHighlightElements] = React.useState<
    Array<{
      id: string
      rect: DOMRect
      highlight: CommentHighlight
    }>
  >([])

  React.useEffect(() => {
    if (!contentRef.current) return

    const updateHighlights = () => {
      const textContent = contentRef.current?.textContent || ""
      const newElements: Array<{ id: string; rect: DOMRect; highlight: CommentHighlight }> = []

      highlights.forEach((highlight) => {
        const startIndex = textContent.indexOf(highlight.text)
        if (startIndex !== -1) {
          // Create a temporary range to get the position
          const range = document.createRange()

          // Find the text node that contains our text
          const walker = document.createTreeWalker(contentRef.current!, NodeFilter.SHOW_TEXT, null)

          let textNode = walker.nextNode()
          let currentOffset = 0

          while (textNode) {
            const nodeLength = textNode.textContent?.length || 0
            if (currentOffset + nodeLength > startIndex) {
              // This text node contains our highlight start
              try {
                const startInNode = startIndex - currentOffset
                const endInNode = Math.min(startInNode + highlight.text.length, nodeLength)

                range.setStart(textNode, startInNode)
                range.setEnd(textNode, endInNode)

                const rect = range.getBoundingClientRect()
                const containerRect = contentRef.current!.getBoundingClientRect()

                // Convert to relative position
                const relativeRect = new DOMRect(
                  rect.left - containerRect.left,
                  rect.top - containerRect.top,
                  rect.width,
                  rect.height,
                )

                newElements.push({
                  id: highlight.id,
                  rect: relativeRect,
                  highlight,
                })
                break
              } catch (error) {
                console.warn("Could not create range for highlight:", error)
              }
            }
            currentOffset += nodeLength
            textNode = walker.nextNode()
          }
        }
      })

      setHighlightElements(newElements)
    }

    // Update highlights when content changes
    const observer = new MutationObserver(updateHighlights)
    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    // Initial update
    updateHighlights()

    return () => observer.disconnect()
  }, [highlights, contentRef])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {highlightElements.map(({ id, rect, highlight }) => (
        <div key={id} className="absolute pointer-events-auto">
          {/* Highlight background */}
          <div
            className="absolute bg-yellow-100 border-b-2 border-yellow-400 hover:bg-yellow-200 transition-colors cursor-pointer rounded-sm"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            }}
            onClick={(e) => onHighlightClick(e, highlight.commentId)}
          />
          {/* Comment badges */}
          <div
            className="absolute flex -space-x-1"
            style={{
              left: rect.left + rect.width - 8,
              top: rect.top - 8,
            }}
          >
            {highlight.authors.slice(0, 2).map((author, i) => (
              <div
                key={`${author.initials}-${i}`}
                className={`w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px] text-white font-medium cursor-pointer hover:scale-110 transition-transform ${author.color}`}
                style={{ zIndex: highlight.authors.length - i }}
                onClick={(e) => {
                  e.stopPropagation()
                  onHighlightClick(e, highlight.commentId)
                }}
              >
                {author.initials}
              </div>
            ))}
            {highlight.authors.length > 2 && (
              <div
                className="w-4 h-4 rounded-full bg-gray-500 border border-white flex items-center justify-center text-[8px] text-white font-medium cursor-pointer hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation()
                  onHighlightClick(e, highlight.commentId)
                }}
              >
                +{highlight.authors.length - 2}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContentEditor() {
  const [title, setTitle] = React.useState("Collaborative Content Strategy Document")
  const [content, setContent] =
    React.useState(`Content writers across multiple domains frequently struggle with maintaining consistency, managing feedback, and collaborating effectively with team members throughout the content creation process.

This challenge significantly impact productivity, quality, and collaboration effectiveness, leading to delayed projects, inconsistent messaging, and frustrated team members who struggle to provide and incorporate feedback efficiently.

Solution Overview

Our collaborative document platform addresses these pain points by providing a seamless editing experience that integrates real-time feedback, version control, and team collaboration features into a single, intuitive interface.`)

  // Initialize comment highlights
  const [commentHighlights, setCommentHighlights] = React.useState<CommentHighlight[]>([
    {
      id: "highlight-1",
      text: "Content writers across multiple domains frequently struggle",
      commentId: "1",
      authors: [
        { initials: "SC", color: "bg-blue-500" },
        { initials: "MJ", color: "bg-green-500" },
      ],
      startOffset: 0,
      endOffset: 53,
    },
    {
      id: "highlight-2",
      text: "productivity, quality, and collaboration effectiveness",
      commentId: "2",
      authors: [
        { initials: "ED", color: "bg-purple-500" },
        { initials: "AK", color: "bg-orange-500" },
      ],
      startOffset: 200,
      endOffset: 252,
    },
    {
      id: "highlight-3",
      text: "document platform",
      commentId: "3",
      authors: [{ initials: "DW", color: "bg-red-500" }],
      startOffset: 450,
      endOffset: 467,
    },
  ])

  const [selectedText, setSelectedText] = React.useState("")
  const [selectionPosition, setSelectionPosition] = React.useState({ x: 0, y: 0 })
  const [showCommentPopup, setShowCommentPopup] = React.useState(false)
  const [showCommentBubble, setShowCommentBubble] = React.useState(false)
  const [commentBubblePosition, setCommentBubblePosition] = React.useState({ x: 0, y: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)

  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
  const readingTime = Math.ceil(wordCount / 200)

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setSelectedText(selection.toString())
      setSelectionPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 10,
      })
      setShowCommentPopup(true)
    }
  }

  const handleAddComment = (comment: string) => {
    console.log("Adding comment:", comment, "for text:", selectedText)

    const selectionStart = content.indexOf(selectedText)
    if (selectionStart !== -1) {
      const newHighlight: CommentHighlight = {
        id: `highlight-${Date.now()}`,
        text: selectedText,
        commentId: `comment-${Date.now()}`,
        authors: [{ initials: "YU", color: "bg-indigo-500" }],
        startOffset: selectionStart,
        endOffset: selectionStart + selectedText.length,
      }

      setCommentHighlights((prev) => [...prev, newHighlight])
    }

    setShowCommentPopup(false)
    setSelectedText("")
  }

  const handleHighlightClick = (event: React.MouseEvent, commentId: string) => {
    event.stopPropagation()
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setCommentBubblePosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 10,
    })
    setShowCommentBubble(true)
  }

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement
    const newContent = element.textContent || ""
    setContent(newContent)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          document.execCommand("bold")
          break
        case "i":
          e.preventDefault()
          document.execCommand("italic")
          break
        case "u":
          e.preventDefault()
          document.execCommand("underline")
          break
        case "s":
          e.preventDefault()
          console.log("Saving document...")
          break
      }
    }
  }

  // Initialize content only once
  React.useEffect(() => {
    if (contentRef.current && !contentRef.current.textContent) {
      contentRef.current.textContent = content
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Viewing
              </Badge>
              <span className="text-sm text-muted-foreground">
                {wordCount} words • {readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-1 border-l pl-4">
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("justifyLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("justifyCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("justifyRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("insertUnorderedList")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.execCommand("insertOrderedList")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.execCommand("formatBlock", false, "blockquote")}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {teamMembers.slice(0, 4).map((member, index) => (
                <Avatar
                  key={member.id}
                  className="h-6 w-6 border-2 border-white"
                  style={{ marginLeft: index > 0 ? "-8px" : "0", zIndex: teamMembers.length - index }}
                >
                  <AvatarFallback className={`text-xs text-white ${member.color}`}>{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-600 ml-[-8px]">
                  +{teamMembers.length - 4}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </Button>

            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-none outline-none bg-transparent mb-8 placeholder-gray-400"
            placeholder="Document title..."
          />

          {/* Content with Overlay */}
          <div className="relative">
            <div
              ref={contentRef}
              className="min-h-[500px] text-base leading-relaxed cursor-text focus:outline-none relative z-10 whitespace-pre-wrap"
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              onMouseUp={handleTextSelection}
              onKeyDown={handleKeyDown}
              onClick={(e) => {
                // Close comment bubble when clicking outside highlighted areas
                if (!(e.target as HTMLElement).closest("[data-comment-id]")) {
                  setShowCommentBubble(false)
                }
              }}
            />

            {/* Highlight Overlay */}
            <HighlightOverlay
              highlights={commentHighlights}
              contentRef={contentRef}
              onHighlightClick={handleHighlightClick}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-muted/50 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last saved: 2 minutes ago</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span>{teamMembers.length} collaborators</span>
          </div>
        </div>
        <FloatingToolbar />
      </div>

      {/* Comment Popup */}
      {showCommentPopup && (
        <CommentPopup
          selectedText={selectedText}
          position={selectionPosition}
          onAddComment={handleAddComment}
          onCancel={() => {
            setShowCommentPopup(false)
            setSelectedText("")
          }}
        />
      )}

      {/* Comment Bubble */}
      {showCommentBubble && (
        <CommentBubble
          comment={mockComment}
          position={commentBubblePosition}
          onClose={() => setShowCommentBubble(false)}
          onLike={(commentId, replyId) => console.log("Like:", commentId, replyId)}
          onResolve={(commentId) => console.log("Resolve:", commentId)}
        />
      )}
    </div>
  )
}
