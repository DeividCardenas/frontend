import { StatCardData } from "../../types/dashboard";

export const StatCard = ({ stat }: { stat: StatCardData }) => {
  const isIncrease = stat.changeType === "increase";
  return (
    <div className="bg-white px-3 py-2 rounded-xl shadow-md flex items-center justify-evenly gap-2 overflow-hidden">
      <div
        className={`flex-shrink-0 p-2 rounded-lg ${
          isIncrease ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {stat.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500" title={stat.title}>
          {stat.title}
        </p>
        <p className="text-xl font-bold text-gray-800">{stat.value}</p>
        <p
          className={`text-sm font-semibold ${
            isIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {stat.change}
        </p>
      </div>
    </div>
  );
};
