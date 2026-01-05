"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";

type DeletePropertyButtonProp = {
  isOpen: boolean;
  isProcessing: boolean;
  onOpenChange: () => void;
  onConfirm: () => Promise<void>;
};

export const DeletePropertyButton = ({
  isOpen,
  isProcessing,
  onOpenChange,
  onConfirm,
}: DeletePropertyButtonProp) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash2 size={4} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            house and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <Button
            disabled={isProcessing}
            variant={"destructive"}
            onClick={(e) => onConfirm()}
          >
            {isProcessing ? (
              <span className="flex items-center gap-x-2">
                <LoaderIcon
                  role="status"
                  aria-label="Loading"
                  className="size-4 animate-spin"
                />
                Processing...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
          <DialogClose
            disabled={isProcessing}
            className={`${buttonVariants({
              variant: "outline",
            })}`}
          >
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
