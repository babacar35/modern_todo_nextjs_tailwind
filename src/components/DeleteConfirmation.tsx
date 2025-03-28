"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  taskName?: string;
}

const DeleteConfirmation = ({
  isOpen = true,
  onClose = () => {},
  onConfirm = () => {},
  taskName = "Sample Task",
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Task
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-900 dark:text-slate-200">
              "{taskName}"
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
