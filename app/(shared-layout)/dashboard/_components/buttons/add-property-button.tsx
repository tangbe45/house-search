import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPropertyForm } from "../forms/add-property-form";

const AddPropertyButton = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className={`flex items-center gap-2`}>
          <PlusCircle className="h-4 w-4" /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-xl shadow-lg mt-0 pt-6 overflow-y-scroll"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>
            Use this form to create property
          </DialogDescription>
        </DialogHeader>
        <div className="h-full">
          <AddPropertyForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyButton;
