import { AnimatePresence, LayoutGroup, motion, Variants } from "framer-motion";
import { CheckCircle2, CircleDotDashed, Circle } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import { type PlateElementProps, PlateElement } from "platejs/react";
import { useEditorRef, useReadOnly } from "platejs/react";
import type { TElement } from "platejs";
import React from "react";

interface ActionElementProps extends PlateElementProps {
  element: {
    type: "action";
    status?: "pending" | "in-progress" | "completed";
    children: any[];
  };
}

// Custom hook for action element state (following PlateJS pattern)
const useActionElementState = ({ element }: { element: TElement }) => {
  const editor = useEditorRef();
  const { status } = element;
  const readOnly = useReadOnly();

  return {
    status: status || "pending",
    editor,
    element,
    readOnly,
  };
};

// Custom hook for action element handlers
const useActionElement = (state: ReturnType<typeof useActionElementState>) => {
  const { status, editor, element, readOnly } = state;

  return {
    statusProps: {
      status: (status as "pending" | "in-progress" | "completed") || "pending",
      onStatusChange: (value: "pending" | "in-progress" | "completed") => {
        if (readOnly) return;

        const path = editor.api.findPath(element);
        if (!path) return;

        editor.tf.setNodes({ status: value }, { at: path });
      },
      onMouseDown: (e: any) => {
        e.preventDefault();
      },
    },
    readOnly,
  };
};

const ActionElement = ({ element, editor, ...props }: ActionElementProps) => {
  const state = useActionElementState({ element });
  const { statusProps, readOnly } = useActionElement(state);

  // Add support for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Toggle status through the three states
  const toggleStatus = () => {
    const statuses: Array<"pending" | "in-progress" | "completed"> = [
      "pending",
      "in-progress",
      "completed",
    ];
    const currentStatus = statusProps.status || "pending";
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];

    statusProps.onStatusChange(newStatus);
  };

  // Animation variants with reduced motion support
  const taskVariants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
      transition: { duration: 0.15 },
    }
  };

  const isCompleted = statusProps.status === "completed";

  return (
    <PlateElement element={element} editor={editor} {...props}>
      <div className="bg-background text-foreground h-full overflow-auto">
        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.2, 0.65, 0.3, 0.9],
            },
          }}
        >
          <LayoutGroup>
            {/* Main task row */}
            <motion.div
              className="group flex items-center py-1.5 rounded-md"
              initial="hidden"
              animate="visible"
              variants={taskVariants}
            >
              <motion.div
                className="mr-2 flex-shrink-0 cursor-pointer focus-visible:outline-none"
                onClick={(e: any) => {
                  e.stopPropagation();
                  toggleStatus();
                }}
                onMouseDown={statusProps.onMouseDown}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={statusProps.status}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                  >
                    {statusProps.status === "completed" ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                    ) : statusProps.status === "in-progress" ? (
                      <CircleDotDashed className="h-4.5 w-4.5 text-blue-500" />
                    ) : (
                      <Circle className="text-muted-foreground h-4.5 w-4.5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="flex min-w-0 flex-grow items-center justify-between"
                onClick={() => {}}
              >
                <div className="mr-2 flex-1 truncate">
                  <span
                    className={`${
                      isCompleted ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {props.children}
                  </span>
                </div>

                <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                  {/* Status Badge */}
                  <motion.span
                    className={`rounded px-1.5 py-0.5 ${
                      statusProps.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : statusProps.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
                      transition: {
                        duration: 0.35,
                        ease: [0.34, 1.56, 0.64, 1],
                      },
                    }}
                    key={statusProps.status}
                  >
                    {statusProps.status}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </div>
    </PlateElement>
  );
};

export const ActionPlugin = createPlatePlugin({
  key: "action",
  node: {
    isElement: true,
    component: ActionElement,
    props: ({ element }) => ({
      "data-status": element.status || "pending",
      className: `action-element status-${element.status || "pending"}`,
    }),
  },
  options: {
    defaultStatus: "pending",
    allowedStatuses: ["pending", "in-progress", "completed"],
  },
});

export const ActionKit = [ActionPlugin];
