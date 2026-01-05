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
import { Pencil, Trash } from "lucide-react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeletePropertyButton } from "@/app/(shared-layout)/dashboard/_components/buttons/delete-property-button";

interface HousesTableProp {
  houses: {
    id: string;
    title: string;
    location: string;
    price: number;
    image: string | StaticImageData;
    status: string;
    createdAt: string;
  }[];
}

export function HousesTable({ houses }: HousesTableProp) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletePropertyDialogIsOpen, setDeletePropertyDialogIsOpen] =
    useState(false);
  const router = useRouter();

  const deleteProperty = async (id: string) => {
    setIsProcessing(true);
    const res = await fetch(`api/houses/${id}`, {
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
    setDeletePropertyDialogIsOpen(false);
    setIsProcessing(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {houses.map((house) => (
          <TableRow key={house.id}>
            <TableCell>
              <Image
                width={80}
                height={80}
                src={house.image}
                alt="House image"
              />
            </TableCell>
            <TableCell>{house.title}</TableCell>
            <TableCell>{house.price}</TableCell>
            <TableCell>{house.location}</TableCell>
            <TableCell>{house.status}</TableCell>
            <TableCell className="text-right space-x-2">
              <Link
                href={`dashboard/houses/${house.id}/edit`}
                className={`${buttonVariants({ variant: "outline" })}`}
              >
                <Pencil size={4} />
              </Link>

              <DeletePropertyButton
                isOpen={deletePropertyDialogIsOpen}
                onOpenChange={() =>
                  setDeletePropertyDialogIsOpen((prev) => !prev)
                }
                isProcessing={isProcessing}
                onConfirm={() => deleteProperty(house.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
