import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Ticket } from "lucide-react";
import { GenerateInviteDialog } from "../web/generate-invite-dialog";
import { HousesTable } from "../web/house-table";
import Link from "next/link";
import {
  getAgentHouses,
  getAgentTokens,
} from "@/app/(shared-layout)/dashboard/actions";
import { StaticImageData } from "next/image";
import { InviteTokenTable } from "../web/invite-token-table";
import { Separator } from "../ui/separator";

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
  invitedEmail: string;
  expiresAt: string;
  used: boolean;
}

export default async function AgentDashboardPage() {
  let houses: housesProps[] = await getAgentHouses();

  let tokens: InviteToken[] = await getAgentTokens();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Agent Dashboard</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Agent Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Account Status</CardTitle>
            <Badge>Agent</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You can list houses and invite new agents.
            </p>
          </CardContent>
        </Card>

        {/* Houses */}
        <section>
          <h2 className="text-lg font-semibold">My Houses</h2>
          <div className="flex flex-wrap gap-4 justify-end mb-4">
            <Link
              className={`${buttonVariants()}`}
              href="/dashboard/houses/add-house"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add House
            </Link>
          </div>
          <HousesTable houses={houses} />
        </section>
        <Separator className="my-12" />

        {/* Tokens */}
        <section>
          <h2 className="text-lg font-semibold">My Generated Invite Tokens</h2>
          {/* Generate Invite Token Action */}
          <div className="flex flex-wrap gap-4 justify-end mb-4">
            <GenerateInviteDialog />
          </div>
          <InviteTokenTable tokens={tokens} />
        </section>
      </main>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { toast } from "sonner";
// import {
//   Trash2,
//   Pencil,
//   SquareUser,
//   PlusCircle,
//   LoaderIcon,
//   Share,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button, buttonVariants } from "@/components/ui/button";
// import Image, { StaticImageData } from "next/image";
// import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
// import { CopyButton } from "../web/copy-button";
// import { isExpired } from "@/lib/is-expired";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { useRouter } from "next/navigation";
// import { CreateInvitToken } from "@/types";
// import { FieldValues } from "react-hook-form";
// import { GenerateInviteTokenForm } from "../forms/generate-invite-token-form";
// import { ShareButton } from "../web/share-button";

// interface housesProps {
//   id: string;
//   title: string;
//   location: string;
//   price: number;
//   image: string | StaticImageData;
//   status: string;
//   createdAt: string;
// }

// interface InviteToken {
//   id: string;
//   token: string;
//   invitedEmail: string;
//   expiresAt: string;
//   used: boolean;
// }

// interface Agent {
//   id: string;
//   name: string;
//   email: string;
// }

// export default function AgentDashboard({
//   houses,
//   tokens,
// }: {
//   houses: housesProps[];
//   tokens: InviteToken[];
// }) {
//   // Dummy states (replace with real data fetching)
//   //const [properties, setProperties] = useState<housesProps[]>(houses);
//   const router = useRouter();
//   const [isHouseDialogOpen, setIsHouseDialogOpen] = useState(false);
//   const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
//   const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const deleteProperty = async (id: string) => {
//     setIsProcessing(true);
//     const res = await fetch(`api/houses/${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = await res.json();

//     if (!result.success) {
//       toast.error(result.message);
//       setIsProcessing(false);
//       return;
//     }

//     toast.success(result.message);
//     router.refresh();
//     setIsHouseDialogOpen(false);
//     setIsProcessing(false);
//   };

//   const copyToken = (token: string) => {
//     navigator.clipboard.writeText(token);
//     toast.info("Token copied!");
//   };

//   // const updateStatus = (id: string, status: Property["status"]) => {
//   //   setProperties((prev) =>
//   //     prev.map((p) => (p.id === id ? { ...p, status } : p))
//   //   );
//   //   toast.success(`Property status updated to ${status}`);
//   // };

//   const [invitedAgents, setInvitedAgents] = useState<Agent[]>([
//     { id: "1", name: "John Doe", email: "user1@example.com" },
//   ]);

//   const deleteToken = async (id: string) => {
//     setIsProcessing(true);
//     const res = await fetch(`api/invite-tokens/${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = await res.json();

//     if (!result.success) {
//       toast.error(result.message);
//       setIsProcessing(false);
//       return;
//     }

//     toast.success(result.message);
//     router.refresh();
//     setIsTokenDialogOpen(false);
//     setIsProcessing(false);
//   };

//   return (
//     <div className="pt-4 w-full h-screen">
//       <div className="py-12 mx-auto p-4 space-y-8 w-full  md:w-[95%]">
//         {/* Analytics Section */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
//             <CardHeader className="w-full p-2 text-center text-xl font-bold">
//               <CardTitle>Total Listings</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
//               {houses.length}
//             </CardContent>
//           </Card>
//           <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
//             <CardHeader className="w-full p-2 text-center text-xl font-bold">
//               <CardTitle>Rented</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
//               {houses.filter((p) => p.status !== "AVAILABLE").length}
//             </CardContent>
//           </Card>
//           <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
//             <CardHeader className="w-full p-2 text-center text-xl font-bold">
//               <CardTitle>Sold</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
//               0
//             </CardContent>
//           </Card>
//           <Card className="pt-0 pb-4 hover:shadow-md gap-4 text-gray-400 overflow-hidden transition">
//             <CardHeader className="w-full p-2 text-center text-xl font-bold">
//               <CardTitle>Token</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center pt-0 text-gray-500 text-4xl font-bold">
//               2
//             </CardContent>
//           </Card>
//         </div>
//         <Separator />
//         {/* Properties Section */}
//         <div className="flex flex-col">
//           <div className="flex grid-cols-subgrid justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">Your Properties</h2>
//           </div>
//           <div className="flex justify-end mb-2">
//             <Link
//               href="dashboard/houses/add-house"
//               className={buttonVariants()}
//             >
//               <PlusCircle size={4} />
//               Add Property
//             </Link>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-25">Image</TableHead>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead className="text-right">Location</TableHead>
//                 <TableHead className="text-right">Status</TableHead>
//                 <TableHead className="text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {houses.map((property) => (
//                 <TableRow key={property.id}>
//                   <TableCell className="font-medium">
//                     <Image
//                       width={80}
//                       height={80}
//                       src={property.image}
//                       alt="House image"
//                     />
//                   </TableCell>
//                   <TableCell>{property.title}</TableCell>
//                   <TableCell>{property.price}</TableCell>
//                   <TableCell className="text-right">
//                     {property.location}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {property.status}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Link
//                       href={`dashboard/houses/${property.id}/edit`}
//                       className={`${buttonVariants({ variant: "ghost" })}`}
//                     >
//                       <Pencil size={4} />
//                     </Link>
//                     <Dialog
//                       open={isHouseDialogOpen}
//                       onOpenChange={setIsHouseDialogOpen}
//                     >
//                       <DialogTrigger asChild>
//                         <Button variant="ghost" className="cursor-pointer">
//                           <Trash2 size={4} />
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Are you absolutely sure?</DialogTitle>
//                           <DialogDescription>
//                             This action cannot be undone. This will permanently
//                             delete this house and remove its data from our
//                             servers.
//                           </DialogDescription>
//                         </DialogHeader>
//                         <DialogFooter className="flex gap-4">
//                           <Button
//                             disabled={isProcessing}
//                             variant={"destructive"}
//                             id={property.id}
//                             onClick={(e) => deleteProperty(e.currentTarget.id)}
//                           >
//                             {isProcessing ? (
//                               <span className="flex items-center gap-x-2">
//                                 <LoaderIcon
//                                   role="status"
//                                   aria-label="Loading"
//                                   className="size-4 animate-spin"
//                                 />
//                                 Processing...
//                               </span>
//                             ) : (
//                               "Delete"
//                             )}
//                           </Button>
//                           <DialogClose
//                             disabled={isProcessing}
//                             className={`${buttonVariants({
//                               variant: "outline",
//                             })}`}
//                           >
//                             Cancel
//                           </DialogClose>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         <Separator />

//         {/* Invitation Section */}
//         <div className="flex flex-col">
//           <div className="flex grid-cols-subgrid justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">Invitation Token</h2>
//           </div>
//           <div className="flex justify-end mb-2">
//             <Dialog
//               open={isGeneratorOpen}
//               onOpenChange={() => setIsGeneratorOpen((prev) => !prev)}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm" className={`flex items-center gap-2`}>
//                   <SquareUser className="h-4 w-4" /> Generate Invitation Token
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add User</DialogTitle>
//                   <DialogDescription>
//                     Add a new user to the database
//                   </DialogDescription>
//                 </DialogHeader>
//                 <GenerateInviteTokenForm
//                   onSetIsGeneratorOpen={(value) => setIsGeneratorOpen(value)}
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-25">Invited Email</TableHead>
//                 <TableHead>Token</TableHead>
//                 <TableHead>Expires At</TableHead>
//                 <TableHead className="text-right">Status</TableHead>
//                 <TableHead className="text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {tokens.map((token) => (
//                 <TableRow key={token.id}>
//                   <TableCell className="font-medium">
//                     {token.invitedEmail}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <span className="font-mono text-sm truncate max-w-45">
//                         {token.token}
//                       </span>
//                       <CopyButton value={token.token} />
//                       <ShareButton value={token.token} />
//                     </div>
//                   </TableCell>
//                   <TableCell>{token.expiresAt}</TableCell>
//                   <TableCell className="text-right">
//                     {token.used ? (
//                       <span className="text-green-600">Used</span>
//                     ) : isExpired(token.expiresAt) ? (
//                       <span className="text-red-600">Not used</span>
//                     ) : (
//                       <span className="text-gray-600">Not used</span>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Dialog
//                       open={isTokenDialogOpen}
//                       onOpenChange={setIsTokenDialogOpen}
//                     >
//                       <DialogTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           disabled={token.used}
//                           className="cursor-pointer"
//                         >
//                           <Trash2 size={4} />
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Are you absolutely sure?</DialogTitle>
//                           <DialogDescription>
//                             This action cannot be undone. This will permanently
//                             delete this token and remove its data from our
//                             servers.
//                           </DialogDescription>
//                         </DialogHeader>
//                         <DialogFooter className="flex gap-4">
//                           <Button
//                             disabled={isProcessing}
//                             variant={"destructive"}
//                             onClick={() => deleteToken(token.id)}
//                           >
//                             {isProcessing ? (
//                               <span className="flex items-center gap-x-2">
//                                 <LoaderIcon
//                                   role="status"
//                                   aria-label="Loading"
//                                   className="size-4 animate-spin"
//                                 />
//                                 Deleting
//                               </span>
//                             ) : (
//                               "Delete"
//                             )}
//                           </Button>
//                           <DialogClose
//                             disabled={isProcessing}
//                             className={`${buttonVariants({
//                               variant: "outline",
//                             })}`}
//                           >
//                             Cancel
//                           </DialogClose>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }
