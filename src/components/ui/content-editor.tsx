"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Image,
  MessageSquare,
  Eye,
  Save,
  Share2,
  MoreHorizontal,
  HighlighterIcon as Highlight,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MousePointer2,
  StickyNote,
  Circle,
  Type,
  Minus,
  Smile,
  PenTool,
  Puzzle,
  ChevronUp,
  Triangle,
  ArrowRight,
  Heart,
  Star,
  Zap,
  X,
  Send,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

const collaborators = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SC",
    status: "online",
  },
  {
    id: 2,
    name: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MJ",
    status: "away",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "ED",
    status: "online",
  },
];

interface Comment {
  id: string;
  author: string;
  avatar: string;
  initials: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  selectedText: string;
  position: { start: number; end: number };
  replies: Array<{
    id: string;
    author: string;
    avatar: string;
    initials: string;
    content: string;
    timestamp: string;
    type: "comment" | "question";
  }>;
}

function FloatingToolbar() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState("selector");

  const mainTools = [
    { id: "selector", icon: MousePointer2, label: "Selector" },
    { id: "sticky", icon: StickyNote, label: "Sticky Notes" },
    { id: "shapes", icon: Circle, label: "Shapes" },
    { id: "text", icon: Type, label: "Text" },
    { id: "connectors", icon: Minus, label: "Connectors" },
    { id: "stamps", icon: Smile, label: "Stamps/Emojis" },
    { id: "drawing", icon: PenTool, label: "Drawing" },
    { id: "widgets", icon: Puzzle, label: "Widgets" },
  ];

  const expandedTools = [
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "heart", icon: Heart, label: "Heart" },
    { id: "star", icon: Star, label: "Star" },
    { id: "lightning", icon: Zap, label: "Lightning" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-2">
        {/* Expanded Tools */}
        {isExpanded && (
          <div className="flex items-center gap-1 mb-2 pb-2 border-b">
            {expandedTools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{tool.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* Main Tools */}
        <div className="flex items-center gap-1">
          {mainTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{tool.label}</TooltipContent>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* More Tools Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">More Tools</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function CommentPopup({
  selectedText,
  position,
  onAddComment,
  onCancel,
}: {
  selectedText: string;
  position: { x: number; y: number };
  onAddComment: (comment: string) => void;
  onCancel: () => void;
}) {
  const [comment, setComment] = React.useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

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
            <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              {selectedText}
            </div>
          </div>
          <Textarea
            placeholder="Add your comment or question..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!comment.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContentEditor() {
  const [title, setTitle] = React.useState("Website Redesign Project Brief");
  const [content, setContent] = React.useState(`# Problem Statement

Content writers across multiple domains frequently struggle with issues throughout the entire content development lifecycle that significantly impact productivity, quality, and collaboration effectiveness.

## Sub Problems

### Fragmented Collaboration and Feedback Loops

The collaboration process becomes fragmented when writers need stakeholder confirmations and feedback. Input gets scattered across emails, document comments, and chat platforms, making it hard to track and address all requirements.

### Disorganized Research and Content Referencing

Writers often collect key information from multiple sources during the research phase, but lack a structured way to highlight, link, and organize those insights. As a result, important points get buried in notes or browser tabs.

## Solution Overview

A unified content workspace that streamlines the entire content development lifecycle—from research to collaboration to version management.

Key capabilities include:
- Integrated Research Hub
- Smart Drafting Environment  
- Centralized Feedback & Review System
- Version & Change Tracking`);

  const [showComments, setShowComments] = React.useState(true);
  const [focusMode, setFocusMode] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "/placeholder.svg?height=24&width=24",
      initials: "SC",
      content:
        "This section needs more detail about the user research findings.",
      timestamp: "2 hours ago",
      resolved: false,
      selectedText:
        "Content writers across multiple domains frequently struggle",
      position: { start: 20, end: 80 },
      replies: [],
    },
    {
      id: "2",
      author: "Mike Johnson",
      avatar: "/placeholder.svg?height=24&width=24",
      initials: "MJ",
      content: "Great insights! Can we add some metrics to support this?",
      timestamp: "1 hour ago",
      resolved: true,
      selectedText:
        "significantly impact productivity, quality, and collaboration effectiveness",
      position: { start: 150, end: 220 },
      replies: [
        {
          id: "2-1",
          author: "Emma Davis",
          avatar: "/placeholder.svg?height=24&width=24",
          initials: "ED",
          content: "I can provide some statistics from our recent survey.",
          timestamp: "30 minutes ago",
          type: "comment",
        },
      ],
    },
  ]);

  const [selectedText, setSelectedText] = React.useState("");
  const [selectionPosition, setSelectionPosition] = React.useState<{
    start: number;
    end: number;
  } | null>(null);
  const [showCommentPopup, setShowCommentPopup] = React.useState(false);
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 });
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(selectedText);
      setSelectionPosition({
        start: range.startOffset,
        end: range.endOffset,
      });
      setPopupPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY + 10,
      });
      setShowCommentPopup(true);
    }
  };

  const handleAddComment = (commentText: string) => {
    if (selectionPosition) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        avatar: "/placeholder.svg?height=24&width=24",
        initials: "CU",
        content: commentText,
        timestamp: "Just now",
        resolved: false,
        selectedText,
        position: selectionPosition,
        replies: [],
      };
      setComments([...comments, newComment]);
    }
    setShowCommentPopup(false);
    setSelectedText("");
    setSelectionPosition(null);
  };

  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      )
    );
  };

  const handleAddReply = (
    commentId: string,
    replyText: string,
    type: "comment" | "question"
  ) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Current User",
      avatar: "/placeholder.svg?height=24&width=24",
      initials: "CU",
      content: replyText,
      timestamp: "Just now",
      type,
    };

    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
      )
    );
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            {/* Formatting Tools */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Highlight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Highlight</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Link</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Research Hub</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status and Collaborators */}
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Draft
            </Badge>

            <div className="flex items-center -space-x-2">
              {collaborators.map((collaborator) => (
                <Tooltip key={collaborator.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={collaborator.avatar || "/placeholder.svg"}
                        alt={collaborator.name}
                      />
                      <AvatarFallback className="text-xs">
                        {collaborator.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {collaborator.name} ({collaborator.status})
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Options */}
            <Button
              variant={showComments ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.filter((c) => !c.resolved).length})
            </Button>

            <Button
              variant={focusMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
            >
              <Eye className="h-4 w-4" />
              Focus
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4" />
              Save
            </Button>

            <Button size="sm">
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Version History</DropdownMenuItem>
                <DropdownMenuItem>Document Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Editor */}
          <div
            className={`flex-1 flex flex-col ${
              focusMode ? "mx-auto max-w-4xl" : ""
            }`}
          >
            {/* Title */}
            <div className="border-b px-6 py-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold border-none px-0 shadow-none focus-visible:ring-0"
                placeholder="Document title..."
              />
            </div>

            {/* Content Editor */}
            <div className="flex-1 p-6">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onMouseUp={handleTextSelection}
                className="min-h-full resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed"
                placeholder="Start writing your content..."
              />
            </div>
          </div>

          {/* Comment Popup */}
          {showCommentPopup && (
            <CommentPopup
              selectedText={selectedText}
              position={popupPosition}
              onAddComment={handleAddComment}
              onCancel={() => {
                setShowCommentPopup(false);
                setSelectedText("");
                setSelectionPosition(null);
              }}
            />
          )}

          {/* Comments Panel */}
          {showComments && !focusMode && (
            <div className="w-80 border-l bg-muted/30">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments & Feedback
                </h3>
              </div>

              <div className="p-4 space-y-4 max-h-full overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={comment.avatar || "/placeholder.svg"}
                          alt={comment.author}
                        />
                        <AvatarFallback className="text-xs">
                          {comment.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                          {comment.resolved ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                          )}
                        </div>

                        {/* Selected Text Context */}
                        <div className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded">
                          {comment.selectedText}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-3">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2"
                              >
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={reply.avatar || "/placeholder.svg"}
                                    alt={reply.author}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {reply.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">
                                      {reply.author}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {reply.timestamp}
                                    </span>
                                    {reply.type === "question" && (
                                      <HelpCircle className="h-3 w-3 text-blue-500" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Input */}
                        {replyingTo === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[60px] text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleAddReply(
                                    comment.id,
                                    replyText,
                                    "comment"
                                  )
                                }
                                disabled={!replyText.trim()}
                              >
                                Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleAddReply(
                                    comment.id,
                                    replyText,
                                    "question"
                                  )
                                }
                                disabled={!replyText.trim()}
                              >
                                <HelpCircle className="h-3 w-3 mr-1" />
                                Ask Question
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => setReplyingTo(comment.id)}
                            >
                              Reply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleResolveComment(comment.id)}
                            >
                              {comment.resolved ? "Unresolve" : "Resolve"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Writing Assistant</span>
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Consider adding specific metrics to strengthen your
                      problem statement. Research shows quantified problems are
                      40% more compelling.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 px-2 text-xs text-blue-700"
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>1,247 words</span>
            <span>6 min read</span>
            <span>Last saved 2 minutes ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Readability: Good
            </Badge>
            <Badge variant="outline" className="text-xs">
              SEO: 85%
            </Badge>
          </div>
        </div>

        {/* Floating Toolbar */}
        <FloatingToolbar />
      </div>
    </TooltipProvider>
  );
}
