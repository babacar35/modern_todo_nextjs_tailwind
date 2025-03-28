"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import TodoHeader from "@/components/TodoHeader";
import TaskFilters from "@/components/TaskFilters";
import TaskList from "@/components/TaskList";
import AddTaskForm from "@/components/AddTaskForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "@/lib/supabase/client";

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

// Default tasks to use if no data in database
const defaultTasks: Task[] = [
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
];

export default function Home() {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const confirmDeleteTask = async () => {
    if (currentTask) {
      try {
        const supabase = createSupabaseClient();

        // Delete from Supabase
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", currentTask.id);

        if (error) throw error;

        // Update local state
        setTasks(tasks.filter((task) => task.id !== currentTask.id));
      } catch (err) {
        console.error("Error deleting task:", err);
        // Still update the UI even if the database operation failed
        setTasks(tasks.filter((task) => task.id !== currentTask.id));
      } finally {
        setIsDeleteConfirmOpen(false);
        setCurrentTask(null);
      }
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      // Find the task to update its completed status
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) return;

      const newCompletedStatus = !taskToUpdate.completed;

      const supabase = createSupabaseClient();

      // Update in Supabase
      const { error } = await supabase
        .from("tasks")
        .update({
          completed: newCompletedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: newCompletedStatus } : task,
        ),
      );
    } catch (err) {
      console.error("Error updating task completion status:", err);
      // Still update the UI even if the database operation failed
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    }
  };

  const handleTaskSubmit = async (data: any) => {
    try {
      const supabase = createSupabaseClient();

      if (isEditing && currentTask) {
        // Update existing task in Supabase
        const { error } = await supabase
          .from("tasks")
          .update({
            title: data.title,
            description: data.description,
            priority: data.priority,
            category: data.category,
            deadline: data.deadline,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentTask.id);

        if (error) throw error;

        // Update local state
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
        // Create new task
        const newTaskId = uuidv4();
        const newTask: Task = {
          id: newTaskId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          category: data.category,
          deadline: data.deadline || new Date(Date.now() + 86400000),
          completed: false,
        };

        // Insert into Supabase
        const { error } = await supabase.from("tasks").insert({
          id: newTaskId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          category: data.category,
          deadline:
            data.deadline?.toISOString() ||
            new Date(Date.now() + 86400000).toISOString(),
          completed: false,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        // Update local state
        setTasks([...tasks, newTask]);
      }
    } catch (err) {
      console.error("Error saving task:", err);
      // Still update the UI even if the database operation failed
      if (isEditing && currentTask) {
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

  // Fetch tasks from Supabase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const supabase = createSupabaseClient();

        const { data, error } = await supabase.from("tasks").select("*");

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform the data to match our Task interface
          const formattedTasks: Task[] = data.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description || "",
            priority: task.priority as Priority,
            category: task.category as Category,
            deadline: task.deadline ? new Date(task.deadline) : new Date(),
            completed: task.completed || false,
          }));

          setTasks(formattedTasks);
        } else {
          // If no tasks in database, use default tasks
          setTasks(defaultTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Using default tasks instead.");
        setTasks(defaultTasks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TodoHeader onAddTask={handleAddTask} title="Modern Todo List" />

        <div className="container mx-auto px-4 py-8">
          <TaskFilters onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Loading tasks...
              </p>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
              <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
              activeFilter={activeFilter.status}
            />
          )}
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
