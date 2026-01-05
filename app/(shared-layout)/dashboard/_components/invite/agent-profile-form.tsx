"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createProfileSchema } from "@/lib/validation/zod-schemas";
import { CreateProfile } from "@/types";

export function AgentProfileForm({ inviteId }: { inviteId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateProfile>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
    },
  });

  async function handleSubmit(values: CreateProfile) {
    setIsLoading(true);

    await fetch("/api/invites/accept", {
      method: "POST",
      body: JSON.stringify({
        inviteId,
        ...values,
      }),
    });

    toast.success("User's role upgraded successfully ");
    setIsLoading(false);
    window.location.reload(); // role upgraded
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="670144798" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp number</FormLabel>
              <FormControl>
                <Input placeholder="670144798" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact email</FormLabel>
              <FormControl>
                <Input placeholder="john@gmail.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Etougebe Monté Sciences, Yaoundé"
                  {...field}
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
                <Loader2 className="size-4 animate-spin" /> Upgrading
              </span>
            ) : (
              "Complete Upgrade"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
