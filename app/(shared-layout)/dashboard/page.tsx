import AgentDashboard from "@/components/dashboards/agent-dashboard";
import { getAgentHouses } from "./actions";
import { headers } from "next/headers";

async function getAgentTokens() {
  const res = await fetch("http://localhost:3000/api/invite-tokens", {
    headers: await headers(),
    cache: "no-store",
  });
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const DashboarPage = async () => {
  const houses = await getAgentHouses();

  const tokens = await getAgentTokens();
  console.log(tokens);

  return <AgentDashboard houses={houses} tokens={tokens} />;
};

export default DashboarPage;
