"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Pencil, SquareUser, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import imageUrl from "../../public/house/house.jpg";
import Image, { StaticImageData } from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { CopyButton } from "../web/copy-button";
import { isExpired } from "@/lib/is-expired";

interface housesProps {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string | StaticImageData;
  status: string;
  createdAt: string;
}

interface InviteToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  used: boolean;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

export default function AgentDashboard({ houses }: { houses: housesProps[] }) {
  // Dummy states (replace with real data fetching)
  const [properties, setProperties] = useState<housesProps[]>(houses);

  const [tokens, setTokens] = useState<InviteToken[]>([
    {
      id: "1",
      token: "AGENT-123ABC",
      email: "user1@example.com",
      expiresAt: "2025-18-01T23:59:59Z",
      used: false,
    },
    {
      id: "2",
      token: "AGENT-XYZ456",
      email: "user2@example.com",
      expiresAt: "2025-11-12T23:59:59Z",
      used: true,
    },
  ]);

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast.warning("Property deleted");
  };

  const generateToken = (email: string) => {
    if (!email) return toast.error("Enter a registered user email");
    const newToken = `AGENT-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    const newEntry = {
      id: Math.random().toString(),
      token: newToken,
      email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      used: false,
    };
    setTokens((prev) => [newEntry, ...prev]);
    toast.success("Invitation token generated!");
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.info("Token copied!");
  };

  // const updateStatus = (id: string, status: Property["status"]) => {
  //   setProperties((prev) =>
  //     prev.map((p) => (p.id === id ? { ...p, status } : p))
  //   );
  //   toast.success(`Property status updated to ${status}`);
  // };

  const [invitedAgents, setInvitedAgents] = useState<Agent[]>([
    { id: "1", name: "John Doe", email: "user1@example.com" },
  ]);

  const deleteToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    toast.warning("Token revoked");
  };

  return (
    <div className="pt-4 w-full h-screen">
      <div className="py-12 mx-auto p-4 space-y-8 w-full  md:w-[95%]">
        {/* Analytics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
            <CardHeader className="w-full p-2 text-center text-xl font-bold">
              <CardTitle>Total Listings</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              {properties.length}
            </CardContent>
          </Card>
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
            <CardHeader className="w-full p-2 text-center text-xl font-bold">
              <CardTitle>Rented</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              {properties.filter((p) => p.status !== "AVAILABLE").length}
            </CardContent>
          </Card>
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
            <CardHeader className="w-full p-2 text-center text-xl font-bold">
              <CardTitle>Sold</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              0
            </CardContent>
          </Card>
          <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
            <CardHeader className="w-full p-2 text-center text-xl font-bold">
              <CardTitle>Token</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
              2
            </CardContent>
          </Card>
        </div>
        <Separator />
        {/* Properties Section */}
        <div className="flex flex-col">
          <div className="flex grid-cols-subgrid justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Properties</h2>
          </div>
          <div className="flex justify-end mb-2">
            <Link
              href="dashboard/houses/add-house"
              className={buttonVariants()}
            >
              <PlusCircle size={4} />
              Add Property
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Location</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <Image
                      width={80}
                      height={80}
                      src={property.image}
                      alt="House image"
                    />
                  </TableCell>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell className="text-right">
                    {property.location}
                  </TableCell>
                  <TableCell className="text-right">
                    {property.status}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">
                      <Pencil size={4} />
                    </Button>
                    <Button variant="ghost">
                      <Trash2 size={4} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Invitation Section */}
        <div className="flex flex-col">
          <div className="flex grid-cols-subgrid justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Invitation Token</h2>
          </div>
          <div className="flex justify-end mb-2">
            <Button size="sm" className={`flex items-center gap-2`}>
              <SquareUser className="h-4 w-4" /> Generate Invitation Token
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Target Email</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{token.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm truncate max-w-45">
                        {token.token}
                      </span>
                      <CopyButton value={token.token} />
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
                    <Button
                      disabled={token.used}
                      onClick={() => console.log("I was clicked")}
                      variant={"ghost"}
                    >
                      <Trash2 size={4} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
