"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  value: string;
};

export function ShareButton({ value }: ShareButtonProps) {
  async function handleShare() {
    await navigator.share({
      title: "Share generated token",
      text: value,
    });
  }

  return (
    <Button
      variant={"ghost"}
      onClick={handleShare}
      className="ml-2 text-xs text-muted-foreground hover:text-primary"
      aria-label="Copy to clipboard"
    >
      <Share2 size={4} />
    </Button>
  );
}
