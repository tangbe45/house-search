import AgentDashboard from "@/components/dashboards/agent-dashboard";
import { getAgentHouses, getAgentTokens } from "./actions";
import { headers } from "next/headers";
import UserDashboard from "@/components/dashboards/user-dashboard";
import { auth } from "@/lib/auth";
import { StaticImageData } from "next/image";

// async function getAgentTokens() {
//   const authHeaders = new Headers(await headers());

//   const res = await fetch(`${process.env.BASE_HOST}/api/invite-tokens`, {
//     headers: authHeaders,
//     cache: "no-store",
//   });
//   console.log(res);

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// }

const DashboarPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log(session?.user.roles);

  if (session?.user.roles.includes("admin")) {
    return <AgentDashboard />;
  } else if (session?.user.roles.includes("agent")) {
    return <AgentDashboard />;
  } else if (session?.user.roles.includes("basic")) {
    return <UserDashboard />;
  }
};

export default DashboarPage;
