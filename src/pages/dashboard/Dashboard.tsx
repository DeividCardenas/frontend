import { StatCard } from "../../components/dashboard/StatCard";
import { WelcomeBanner } from "../../components/dashboard/WelcomeBanner";
import { PerformanceChart } from "../../components/dashboard/PerformanceChart";
import { PendingTasks } from "../../components/dashboard/PendingTasks";
import { StatCardData } from "../../types/dashboard";

// Datos de ejemplo para los KPIs
const stats: StatCardData[] = [
  {
    title: "Cumplimiento Normativo",
    value: "98%",
    change: "+2%",
    changeType: "increase",
    icon: <span className="text-2xl">✅</span>,
  },
  {
    title: "Consumo de Agua",
    value: "150m³",
    change: "-5%",
    changeType: "decrease",
    icon: <span className="text-2xl">💧</span>,
  },
  {
    title: "Generación de Residuos",
    value: "2.1t",
    change: "-10%",
    changeType: "decrease",
    icon: <span className="text-2xl">🗑️</span>,
  },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <WelcomeBanner />

        {/* Sección de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>

        <PerformanceChart />
      </div>

      <div className="lg:col-span-1">
        <PendingTasks />
      </div>
    </div>
  );
}
