"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InviteTokenDialog } from "../invite/invite-token-dialog";

export function BecomeAgentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Enter Invite Token</Button>

      <InviteTokenDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
