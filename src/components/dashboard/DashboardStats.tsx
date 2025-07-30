import { FolderOpen, Upload, BarChart3 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import type { DashboardStats as StatsType } from "../../types";

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      name: "Projects",
      value: stats.projectsCount,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Uploads",
      value: stats.uploadsCount,
      icon: Upload,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Charts",
      value: stats.chartsCount,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item) => (
        <Card key={item.name}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{item.name}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};