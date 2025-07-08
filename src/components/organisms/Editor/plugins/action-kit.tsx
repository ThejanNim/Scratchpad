import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CheckCircle2, CircleDotDashed, Circle } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import { type PlateElementProps, PlateElement } from "platejs/react";
import React, { useState } from "react";

interface ActionElementProps extends PlateElementProps {
  element: {
    type: "action";
    tasks?: Task[];
    children: any[];
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research Project Requirements",
    description:
      "Gather all necessary information about project scope and requirements",
    status: "pending",
    priority: "high",
    level: 0,
  },
];

const ActionElement = ({ element, editor, ...props }: ActionElementProps) => {
  const [tasks, setTasks] = useState<Task[]>(element.tasks || initialTasks);

  // Add support for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Toggle task status
  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const statuses = ["pending", "in-progress", "completed"];
          const currentIndex = statuses.indexOf(task.status);
          const nextIndex = (currentIndex + 1) % statuses.length;
          const newStatus = statuses[nextIndex];

          return {
            ...task,
            status: newStatus,
          };
        }
        return task;
      })
    );
  };

  // Animation variants with reduced motion support
  const taskVariants = {
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
    },
  };

  // Status badge animation variants
  const statusBadgeVariants = {
    initial: { scale: 1 },
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1], // Springy custom easing for bounce effect
      },
    },
  };

  return (
    <PlateElement element={element} editor={editor} {...props}>
      {/* <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div>Action: </div>
        <div 
          className={`flex-1 ${checked ? 'line-through text-gray-500' : ''}`}
        >
          {props.children}
        </div>
      </div> */}

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
            <div className="overflow-hidden">
              <ul className="space-y-1 overflow-hidden">
                {tasks.map((task, index) => {
                  const isCompleted = task.status === "completed";

                  return (
                    <motion.li
                      key={task.id}
                      className={` ${index !== 0 ? "mt-1 pt-2" : ""} `}
                      initial="hidden"
                      animate="visible"
                      variants={taskVariants}
                    >
                      {/* Task row */}
                      <motion.div
                        className="group flex items-center py-1.5 rounded-md"
                      >
                        <motion.div
                          className="mr-2 flex-shrink-0 cursor-pointer focus-visible:outline-none"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            toggleTaskStatus(task.id);
                          }}
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={task.status}
                              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                              transition={{
                                duration: 0.2,
                                ease: [0.2, 0.65, 0.3, 0.9],
                              }}
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                              ) : task.status === "in-progress" ? (
                                <CircleDotDashed className="h-4.5 w-4.5 text-blue-500" />
                              ) : (
                                <Circle className="text-muted-foreground h-4.5 w-4.5" />
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                          onClick={() => {}}
                        >
                          <div className="mr-2 flex-1 truncate">
                            <span
                              className={`${
                                isCompleted
                                  ? "text-muted-foreground line-through"
                                  : ""
                              }`}
                            >
                              {/* {task.title} */}
                              {props?.element.checked}
                              {props.children}
                            </span>
                          </div>

                          <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                            <motion.span
                              className={`rounded px-1.5 py-0.5 ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : task.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              variants={statusBadgeVariants}
                              initial="initial"
                              animate="animate"
                              key={task.status} // Force animation on status change
                            >
                              {task.status}
                            </motion.span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
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
  },
});

export const ActionKit = [ActionPlugin];
