import React from "react";
import {
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
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "./button";
import { Separator } from "./separator";

interface FloatingToolbarProps {
  children?: React.ReactNode;
  className?: string;
  // Add other props as needed
}

export function FloatingToolbar({ children, className, ...props }: FloatingToolbarProps) {
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
