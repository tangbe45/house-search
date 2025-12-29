"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { CreateInvitToken } from "@/types";
import { createInviteTokenSchema } from "@/lib/validation/zod-schemas";

interface GenerateInviteTokenFormProps {
  onSetIsGeneratorOpen: (value: boolean) => void;
}

export const GenerateInviteTokenForm = ({
  onSetIsGeneratorOpen,
}: GenerateInviteTokenFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<CreateInvitToken>({
    resolver: zodResolver(
      createInviteTokenSchema
    ) as Resolver<CreateInvitToken>,
    defaultValues: {
      targetEmail: "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      used: false,
      token: `AGENT-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
    },
  });

  async function onSubmit(values: CreateInvitToken) {
    try {
      setIsLoading(true);

      const res = await fetch("/api/invite-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
        }),
      });

      const token = await res.json();
      console.log(token);

      toast.success("Invite token created successfully");
      router.refresh();
      onSetIsGeneratorOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="targetEmail"
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
        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expires At</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  type="datetime-local"
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="used"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  hidden
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
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
            onClick={() => onSetIsGeneratorOpen(false)}
            disabled={isLoading}
            type="button"
            variant={"outline"}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
