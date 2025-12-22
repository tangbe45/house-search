import AgentDashboard from "@/components/dashboards/agent-dashboard";
import { getAgentHouses } from "./actions";

const DashboarPage = async () => {
  const houses = await getAgentHouses();

  return <AgentDashboard houses={houses} />;
};

export default DashboarPage;
