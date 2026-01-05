import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Users, Key, Home } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-24">
      <section className="relative bg-linear-to-b from-slate-950 to-slate-900 text-white py-28">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Find Verified Homes.
            <br />
            Work With Trusted Agents.
          </h1>

          <p className="mt-6 text-lg text-slate-300">
            A secure and professional house search platform designed for serious
            renters, buyers, and relocation clients.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/houses" className={`${buttonVariants()} text-lg`}>
              Search Homes
            </Link>
            <Link
              href="/houses"
              className={`${buttonVariants({ variant: "outline" })} text-lg`}
            >
              List a Property
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-6">
          <TrustCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Verified Agents"
            description="Only approved agents and property owners can list homes."
          />
          <TrustCard
            icon={<Home className="h-6 w-6" />}
            title="Quality Listings"
            description="No fake listings, no duplicated photos, no spam."
          />
          <TrustCard
            icon={<Users className="h-6 w-6" />}
            title="Serious Clients"
            description="Designed for professionals, families, and expatriates."
          />
          <TrustCard
            icon={<Key className="h-6 w-6" />}
            title="Secure Access"
            description="Controlled invitations and role-based access."
          />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold text-center">
            A Better Way to Find a Home
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-10">
            <Step
              step="01"
              title="Search With Confidence"
              text="Browse verified properties with accurate location, pricing, and images."
            />
            <Step
              step="02"
              title="Connect With Professionals"
              text="Deal only with approved agents and trusted property owners."
            />
            <Step
              step="03"
              title="Move Without Stress"
              text="Relocation services and guided support from search to move-in."
            />
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION ================= */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Built for People Who Value Time & Security
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">
              This platform is not for everyone — and that’s intentional. We
              focus on verified listings, controlled access, and professional
              conduct.
            </p>

            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li>• No fake agents</li>
              <li>• No misleading photos</li>
              <li>• No time-wasting visits</li>
              <li>• Clear roles and accountability</li>
            </ul>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold">
                Are You an Agent or Property Owner?
              </h3>
              <p className="mt-4 text-muted-foreground">
                Grow your credibility and reach high-quality clients by listing
                verified properties.
              </p>
              <Button className="mt-6 w-full">Request Agent Access</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold">
            Your Next Home Starts With Trust
          </h2>
          <p className="mt-6 text-slate-300 text-lg">
            Join a platform built for quality, security, and professionalism.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/houses" className={`${buttonVariants()} text-lg`}>
              Explore Homes
            </Link>
            <Link
              href="/auth/sign-up"
              className={`${buttonVariants({ variant: "outline" })} text-lg`}
            >
              Become an Agent
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-slate-200">{step}</div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}
