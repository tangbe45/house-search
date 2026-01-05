"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function VerifyTokenForm({
  onVerified,
}: {
  onVerified: (inviteId: string) => void;
}) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setLoading(true);
    setError(null);
    console.log("I am here");

    // 🔒 Backend verification
    const res = await fetch("/api/invites/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    console.log("I am here now");

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Invalid or expired token");
      return;
    }

    toast.success("Token is valid");
    // Success → move to next step
    onVerified(data.inviteId);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter the invite token you received to become an agent.
      </p>

      <Input
        placeholder="Invite token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        className="w-full"
        onClick={handleVerify}
        disabled={!token || loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify Token
      </Button>
    </div>
  );
}
