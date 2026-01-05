"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Copy, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createInviteTokenSchema } from "@/lib/validation/zod-schemas";
import { CreateInvitToken } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GenerateInviteDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createInviteTokenSchema),
    defaultValues: { invitedEmail: "" },
  });

  async function generateToken(values: CreateInvitToken) {
    try {
      setIsLoading(true);
      const res = await fetch("/api/invite-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        setIsLoading(false);
        return;
      }

      toast.success("Invite token generated successfully");
      router.refresh();
      setIsLoading(false);
      form.reset();
      setOpen(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Ticket className="mr-2 h-4 w-4" />
        Generate Invite Token
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invite Token</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(generateToken)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="invitedEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-x-2">
                      <Loader2 className="size-4 animate-spin" /> Generating
                    </span>
                  ) : (
                    "Generate"
                  )}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  type="button"
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
