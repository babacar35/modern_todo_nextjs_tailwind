"use client";

import React, { useState } from "react";
import { ThemeProvider } from "next-themes";
import TodoHeader from "@/components/TodoHeader";
import TaskFilters from "@/components/TaskFilters";
import TaskList from "@/components/TaskList";
import AddTaskForm from "@/components/AddTaskForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { v4 as uuidv4 } from "uuid";

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

export default function Home() {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Complete project proposal",
      description: "Finish the draft and send it to the team for review",
      priority: "high",
      category: "work",
      deadline: new Date(Date.now() + 86400000), // tomorrow
      completed: false,
    },
    {
      id: "task-2",
      title: "Grocery shopping",
      description: "Buy fruits, vegetables, and other essentials",
      priority: "medium",
      category: "shopping",
      deadline: new Date(Date.now() + 172800000), // day after tomorrow
      completed: false,
    },
    {
      id: "task-3",
      title: "Morning jog",
      description: "30 minutes run in the park",
      priority: "low",
      category: "health",
      deadline: new Date(Date.now() - 86400000), // yesterday
      completed: true,
    },
    {
      id: "task-4",
      title: "Call mom",
      description: "Weekly check-in call",
      priority: "medium",
      category: "personal",
      deadline: new Date(Date.now() + 259200000), // 3 days from now
      completed: false,
    },
  ]);

  // State for modals
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for filters
  const [activeFilter, setActiveFilter] = useState({
    status: "all",
    priority: null,
    category: null,
    dateRange: { from: null, to: null },
  });

  // Handlers
  const handleAddTask = () => {
    setCurrentTask(null);
    setIsEditing(false);
    setIsAddTaskOpen(true);
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setCurrentTask(taskToEdit);
      setIsEditing(true);
      setIsAddTaskOpen(true);
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) {
      setCurrentTask(taskToDelete);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDeleteTask = () => {
    if (currentTask) {
      setTasks(tasks.filter((task) => task.id !== currentTask.id));
      setIsDeleteConfirmOpen(false);
      setCurrentTask(null);
    }
  };

  const handleCompleteTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleTaskSubmit = (data: any) => {
    if (isEditing && currentTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                title: data.title,
                description: data.description,
                priority: data.priority,
                category: data.category,
                deadline: data.deadline,
              }
            : task,
        ),
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        deadline: data.deadline || new Date(Date.now() + 86400000),
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilter(filters);
  };

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (activeFilter.status === "active" && task.completed) return false;
    if (activeFilter.status === "completed" && !task.completed) return false;

    // Filter by priority
    if (
      activeFilter.priority &&
      task.priority !== activeFilter.priority.toLowerCase()
    )
      return false;

    // Filter by category
    if (
      activeFilter.category &&
      task.category !== activeFilter.category.toLowerCase()
    )
      return false;

    // Filter by date range
    if (
      activeFilter.dateRange.from &&
      task.deadline < activeFilter.dateRange.from
    )
      return false;
    if (activeFilter.dateRange.to && task.deadline > activeFilter.dateRange.to)
      return false;

    return true;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TodoHeader onAddTask={handleAddTask} title="Modern Todo List" />

        <div className="container mx-auto px-4 py-8">
          <TaskFilters onFilterChange={handleFilterChange} />

          <TaskList
            tasks={filteredTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
            activeFilter={activeFilter.status}
          />
        </div>

        {/* Modals */}
        <AddTaskForm
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          onSubmit={handleTaskSubmit}
          initialData={
            isEditing && currentTask
              ? {
                  id: currentTask.id,
                  title: currentTask.title,
                  description: currentTask.description,
                  priority: currentTask.priority,
                  category: currentTask.category,
                  deadline: currentTask.deadline,
                }
              : undefined
          }
          isEditing={isEditing}
        />

        <DeleteConfirmation
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDeleteTask}
          taskName={currentTask?.title}
        />
      </main>
    </ThemeProvider>
  );
}
