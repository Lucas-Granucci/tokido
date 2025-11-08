import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Task } from "./interfaces";
import { Calendar, X } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useTasks } from "@/contexts/tasks-context";
import confetti from "canvas-confetti";
import {
  getPriorityColor,
  getDurationColor,
  getCategoryColor,
} from "./utils/config-utils";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);
  const durationColor = getDurationColor(task.duration);

  const handleDelete = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 15,
        origin: { x, y },
        colors: ["#00ff88", "#0080ff", "#ff0080"],
        gravity: 0.8,
        scalar: 0.8,
        ticks: 120,
      });
    }

    toast.success("Task Completed!", {
      description: `"${task.name}" has been marked as complete`,
      duration: 3000,
    });

    setIsDeleting(true);

    setTimeout(() => {
      deleteTask(task.id);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          layout
          initial={{ opacity: 1, scale: 1, height: "auto" }}
          exit={{
            opacity: 0,
            scale: 0.8,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card className="p-1 hover:shadow-md transition-shadow duration-200">
            <CardContent className="pl-2 pr-0">
              <div className="flex flex-row items-center justify-between">
                <span className="text-sm">{task.name}</span>
                <Button
                  ref={buttonRef}
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDelete}
                >
                  <X />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                  }}
                >
                  {task.category}
                </Badge>
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: `${durationColor}20`,
                    color: durationColor,
                  }}
                >
                  {task.duration} min
                </Badge>
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: `${priorityColor}20`,
                    color: priorityColor,
                  }}
                >
                  {task.priority}
                </Badge>
              </div>
              <span className="inline-flex items-center justify-center text-muted-foreground gap-1.5">
                <Calendar size={14} />
                <span className="text-xs">
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              </span>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
