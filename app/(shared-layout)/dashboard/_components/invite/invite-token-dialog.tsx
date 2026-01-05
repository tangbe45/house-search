"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VerifyTokenForm } from "./verify-token-form";
import { AgentProfileForm } from "./agent-profile-form";

type Step = "verify" | "profile";

export function InviteTokenDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("verify");
  const [inviteId, setInviteId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "verify"
              ? "Verify Invite Token"
              : "Complete Agent Profile"}
          </DialogTitle>
        </DialogHeader>

        {step === "verify" && (
          <VerifyTokenForm
            onVerified={(inviteId) => {
              setInviteId(inviteId);
              setStep("profile");
            }}
          />
        )}

        {step === "profile" && inviteId && (
          <AgentProfileForm inviteId={inviteId} />
        )}
      </DialogContent>
    </Dialog>
  );
}
