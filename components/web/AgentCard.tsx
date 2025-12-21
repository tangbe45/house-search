import Image from "next/image";

export function AgentCard({ agent }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg">Agent Information</h3>

      <div className="flex items-center gap-4">
        <Image
          src={agent.avatar}
          alt={agent.name}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{agent.name}</p>
          <p className="text-sm text-gray-500">Verified Agent</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <a
          href={`mailto:${agent.email}`}
          className="block text-primary hover:underline"
        >
          📧 {agent.email}
        </a>
        <a
          href={`tel:${agent.phone}`}
          className="block text-primary hover:underline"
        >
          📞 {agent.phone}
        </a>
        <a
          href={`https://wa.me/${agent.whatsapp.replace("+", "")}`}
          target="_blank"
          className="block text-primary hover:underline"
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}
