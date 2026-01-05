"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoaderIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";
import { isExpired } from "@/lib/is-expired";

interface InviteTokenTableProps {
  tokens: {
    id: string;
    token: string;
    invitedEmail: string;
    expiresAt: string;
    used: boolean;
  }[];
}

export function InviteTokenTable({ tokens }: InviteTokenTableProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTokenDeleteDialogOpen, setIsTokenDeleteDialogOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const router = useRouter();

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.info("Token copied!");
  };

  const deleteToken = async (id: string) => {
    setIsProcessing(true);
    const res = await fetch(`api/invite-tokens/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!result.success) {
      toast.error(result.message);
      setIsProcessing(false);
      return;
    }

    toast.success(result.message);
    router.refresh();
    setIsTokenDeleteDialogOpen(false);
    setIsProcessing(false);
  };

  return (
    <>
      <div className="flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Invited Email</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">
                  {token.invitedEmail}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm truncate max-w-45">
                      {token.token}
                    </span>
                    <CopyButton value={token.token} />
                    <ShareButton value={token.token} />
                  </div>
                </TableCell>
                <TableCell>{token.expiresAt}</TableCell>
                <TableCell className="text-right">
                  {token.used ? (
                    <span className="text-green-600">Used</span>
                  ) : isExpired(token.expiresAt) ? (
                    <span className="text-red-600">Not used</span>
                  ) : (
                    <span className="text-gray-600">Not used</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog
                    open={isTokenDeleteDialogOpen}
                    onOpenChange={setIsTokenDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        disabled={token.used}
                        className="cursor-pointer"
                      >
                        <Trash2 size={4} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete this token and remove its data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex gap-4">
                        <Button
                          disabled={isProcessing}
                          variant={"destructive"}
                          onClick={() => deleteToken(token.id)}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-x-2">
                              <LoaderIcon
                                role="status"
                                aria-label="Loading"
                                className="size-4 animate-spin"
                              />
                              Deleting
                            </span>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                        <DialogClose
                          disabled={isProcessing}
                          className={`${buttonVariants({
                            variant: "outline",
                          })}`}
                        >
                          Cancel
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
