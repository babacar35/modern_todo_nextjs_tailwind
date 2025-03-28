"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskFiltersProps {
  onFilterChange?: (filters: {
    status: string;
    priority: string | null;
    category: string | null;
    dateRange: { from: Date | null; to: Date | null };
  }) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  // Mock data for filters
  const priorities = ["High", "Medium", "Low"];
  const categories = ["Work", "Personal", "Shopping", "Health", "Education"];

  const handleStatusChange = (value: string) => {
    setStatus(value);
    triggerFilterChange(value, priority, category, dateRange);
  };

  const handlePriorityChange = (value: string | null) => {
    setPriority(value === "all_priorities" ? null : value);
    triggerFilterChange(
      status,
      value === "all_priorities" ? null : value,
      category,
      dateRange,
    );
  };

  const handleCategoryChange = (value: string | null) => {
    setCategory(value === "all_categories" ? null : value);
    triggerFilterChange(
      status,
      priority,
      value === "all_categories" ? null : value,
      dateRange,
    );
  };

  const handleDateRangeChange = (range: {
    from: Date | null;
    to: Date | null;
  }) => {
    setDateRange(range);
    triggerFilterChange(status, priority, category, range);
  };

  const clearFilters = () => {
    setStatus("all");
    setPriority(null);
    setCategory(null);
    setDateRange({ from: null, to: null });
    triggerFilterChange("all", null, null, { from: null, to: null });
  };

  const triggerFilterChange = (
    statusValue: string,
    priorityValue: string | null,
    categoryValue: string | null,
    dateRangeValue: { from: Date | null; to: Date | null },
  ) => {
    if (onFilterChange) {
      onFilterChange({
        status: statusValue,
        priority: priorityValue,
        category: categoryValue,
        dateRange: dateRangeValue,
      });
    }
  };

  const hasActiveFilters =
    priority !== null || category !== null || dateRange.from !== null;

  return (
    <div className="w-full bg-background p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <Tabs
            defaultValue={status}
            value={status}
            onValueChange={handleStatusChange}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select
              value={priority || "all_priorities"}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_priorities">All Priorities</SelectItem>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={category || "all_categories"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={dateRange.from ? "default" : "outline"}
                  className="w-full sm:w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from || undefined}
                  selected={{
                    from: dateRange.from || undefined,
                    to: dateRange.to || undefined,
                  }}
                  onSelect={(range) => {
                    handleDateRangeChange({
                      from: range?.from || null,
                      to: range?.to || null,
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 self-end md:self-auto"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtering by:</span>
          {priority && (
            <span className="bg-primary/10 px-2 py-1 rounded-md text-xs">
              {priority}
            </span>
          )}
          {category && (
            <span className="bg-primary/10 px-2 py-1 rounded-md text-xs">
              {category}
            </span>
          )}
          {dateRange.from && (
            <span className="bg-primary/10 px-2 py-1 rounded-md text-xs">
              {format(dateRange.from, "MMM d")}
              {dateRange.to && `- ${format(dateRange.to, "MMM d")}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
