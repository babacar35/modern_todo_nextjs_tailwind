"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Priority = "low" | "medium" | "high";
type Category = "work" | "personal" | "shopping" | "health" | "other";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  deadline: Date;
  completed: boolean;
}

interface TaskListProps {
  tasks?: Task[];
  onAddTask?: () => void;
  onEditTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onCompleteTask?: (id: string) => void;
  activeFilter?: string;
}

const TaskList = ({
  tasks = [
    {
      id: "task-1",
      title: "Complete project proposal",
      description: "Finish the draft and send it to the team for review",
      priority: "high" as Priority,
      category: "work" as Category,
      deadline: new Date(Date.now() + 86400000), // tomorrow
      completed: false,
    },
    {
      id: "task-2",
      title: "Grocery shopping",
      description: "Buy fruits, vegetables, and other essentials",
      priority: "medium" as Priority,
      category: "shopping" as Category,
      deadline: new Date(Date.now() + 172800000), // day after tomorrow
      completed: false,
    },
    {
      id: "task-3",
      title: "Morning jog",
      description: "30 minutes run in the park",
      priority: "low" as Priority,
      category: "health" as Category,
      deadline: new Date(Date.now() - 86400000), // yesterday
      completed: true,
    },
    {
      id: "task-4",
      title: "Call mom",
      description: "Weekly check-in call",
      priority: "medium" as Priority,
      category: "personal" as Category,
      deadline: new Date(Date.now() + 259200000), // 3 days from now
      completed: false,
    },
  ],
  onAddTask = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onCompleteTask = () => {},
  activeFilter = "all",
}: TaskListProps) => {
  const [activeTab, setActiveTab] = useState<string>("active");

  // Filter tasks based on active tab
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {activeTab === "active" ? "Active Tasks" : "Completed Tasks"}
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            (
            {activeTab === "active"
              ? activeTasks.length
              : completedTasks.length}
            )
          </span>
        </h2>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-2">
                <h3 className="font-medium">Filter by</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    High Priority
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Work
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Due Today
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={onAddTask}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {activeTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No active tasks
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                You don't have any active tasks. Add a new task to get started.
              </p>
              <Button onClick={onAddTask} size="sm">
                Add your first task
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  category={task.category}
                  deadline={task.deadline}
                  completed={task.completed}
                  onComplete={onCompleteTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No completed tasks
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                You haven't completed any tasks yet. Complete a task to see it
                here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  category={task.category}
                  deadline={task.deadline}
                  completed={task.completed}
                  onComplete={onCompleteTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
