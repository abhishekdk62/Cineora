"use client";

import { useState, useEffect } from "react";
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

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

let resolver: ((value: boolean) => void) | null = null;

export function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps>({
    title,
    message,
    confirmText,
    cancelText,
  });

  useEffect(() => {
    (window as any).__openConfirmDialog = (opts: ConfirmDialogProps) => {
      setDialogProps(opts);
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        resolver = resolve;
      });
    };
  }, []);

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolver?.(result);
    resolver = null;
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-slate-800 text-slate-50 dark:bg-slate-900 dark:text-slate-100 rounded-lg shadow-lg p-6 border border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogProps.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogProps.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end space-x-2">
          <AlertDialogCancel
            onClick={() => handleClose(false)}
            className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/90"
          >
            {dialogProps.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleClose(true)}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            {dialogProps.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function confirmAction(props: ConfirmDialogProps) {
  return (window as any).__openConfirmDialog(props) as Promise<boolean>;
}
