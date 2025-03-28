"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Plus } from "lucide-react";

interface TodoHeaderProps {
  onAddTask?: () => void;
  title?: string;
}

const TodoHeader = ({
  onAddTask = () => console.log("Add task clicked"),
  title = "Modern Todo List",
}: TodoHeaderProps) => {
  return (
    <header className="w-full h-20 px-4 md:px-6 lg:px-8 flex items-center justify-between border-b bg-background">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <ThemeSwitcher />

        <Button onClick={onAddTask} className="flex items-center gap-2">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    </header>
  );
};

export default TodoHeader;
