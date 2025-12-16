"use client";

import { Check, Copy, Ticket } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      variant={"ghost"}
      onClick={handleCopy}
      className="ml-2 text-xs text-muted-foreground hover:text-primary"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={4} /> : <Copy size={4} />}
      {/* {copied ? `${<Copy size={4} />}`"Copied ✓" : "Copy"} */}
    </Button>
  );
}
