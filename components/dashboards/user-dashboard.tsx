import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Home, Search, UserCheck, Shield } from "lucide-react";
import { BecomeAgentButton } from "@/app/(shared-layout)/dashboard/_components/buttons/become-an-agent-button";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Welcome back 👋</CardTitle>
            <Badge variant="secondary">Basic User</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are currently using a basic account. Upgrade to become an
              agent and start listing houses.
            </p>
          </CardContent>
        </Card>

        {/* Become Agent CTA */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Become an Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Agents can list houses, upload images, and connect with tenants.
            </p>
            <div className="flex gap-3">
              <BecomeAgentButton />
              {/* <Button variant="outline">Learn More</Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Available Features */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            What you can do right now
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <FeatureCard
              icon={Home}
              title="Browse Houses"
              description="Explore available house listings."
            />
            <FeatureCard
              icon={Search}
              title="Search by Location"
              description="Filter houses by region and price."
            />
            <FeatureCard
              icon={Shield}
              title="Verified Listings"
              description="View houses added by verified agents."
            />
          </div>
        </section>

        {/* Locked Features */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
            Agent Features (Locked)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <LockedFeature title="Add House Listings" />
            <LockedFeature title="Upload Property Images" />
            <LockedFeature title="Manage Your Listings" />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function LockedFeature({ title }: { title: string }) {
  return (
    <Card className="opacity-70">
      <CardHeader className="flex flex-row items-center gap-3">
        <Lock className="h-5 w-5" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Upgrade to agent to unlock this feature.
        </p>
      </CardContent>
    </Card>
  );
}
