"use client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterForm from "@/app/(shared-layout)/houses/_components/filter-form";
import { useState } from "react";

export const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <SlidersHorizontal size={4} />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>House Filter</DialogTitle>
          <DialogDescription>
            Reduce the number of house to the area of interest
          </DialogDescription>
        </DialogHeader>
        <FilterForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
