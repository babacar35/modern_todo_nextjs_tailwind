"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high";
type Category = "work" | "personal" | "shopping" | "health" | "other";

interface TaskCardProps {
  id?: string;
  title?: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  deadline?: Date;
  completed?: boolean;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const categoryColors = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  personal:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  shopping: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  health: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const TaskCard = ({
  id = "task-1",
  title = "Complete project proposal",
  description = "Finish the draft and send it to the team for review",
  priority = "medium",
  category = "work",
  deadline = new Date(Date.now() + 86400000), // tomorrow
  completed = false,
  onComplete = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: TaskCardProps) => {
  const isOverdue = deadline && new Date() > deadline && !completed;
  const isUpcoming =
    deadline &&
    new Date() < deadline &&
    new Date(deadline.getTime() - 86400000) < new Date(); // within 24 hours

  const formattedDate = deadline
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(deadline)
    : "";

  return (
    <Card
      className={cn(
        "w-full max-w-[350px] h-[180px] transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800",
        completed && "opacity-70 bg-gray-50 dark:bg-gray-900",
      )}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start gap-2">
          <Checkbox
            id={`task-${id}`}
            checked={completed}
            onCheckedChange={() => onComplete(id)}
            className="mt-1"
          />
          <div>
            <h3
              className={cn(
                "font-medium text-lg line-clamp-1",
                completed && "line-through text-gray-500 dark:text-gray-400",
              )}
            >
              {title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary" className={priorityColors[priority]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
              <Badge variant="secondary" className={categoryColors[category]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p
          className={cn(
            "text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2",
            completed && "text-gray-400 dark:text-gray-500",
          )}
        >
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div
          className={cn(
            "flex items-center text-sm",
            isOverdue
              ? "text-red-600 dark:text-red-400"
              : isUpcoming
                ? "text-amber-600 dark:text-amber-400"
                : "text-gray-600 dark:text-gray-400",
          )}
        >
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
