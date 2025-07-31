import { useGetDashboardQuery } from "../store/api/authApi";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { RecentUploads } from "../components/dashboard/RecentUploads";
import { RecentProjects } from "../components/dashboard/RecentProjects";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export const Dashboard = () => {
  const { data, isLoading, error } = useGetDashboardQuery();

  const { user } = useAuth();
  // if not authenticated, redirect to login
  if(!user){
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { stats, recentUploads, recentProjects } = data.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your activity.</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentUploads uploads={recentUploads} />
        <RecentProjects projects={recentProjects} />
      </div>
    </div>
  );
};
