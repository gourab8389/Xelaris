import { toast } from "sonner";
import {
  useCreateChartMutation,
  useGetChartsQuery,
  useGetChartQuery,
  useUpdateChartMutation,
  useDeleteChartMutation,
} from "../store/api/chartsApi";
import type { CreateChartData } from "../types";

export const useCharts = () => {
  const [createChart] = useCreateChartMutation();
  const [updateChart] = useUpdateChartMutation();
  const [deleteChart] = useDeleteChartMutation();

  const handleCreateChart = async (uploadId: string, data: CreateChartData) => {
    try {
      const result = await createChart({ uploadId, data }).unwrap();
      toast.success("Chart created successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chart");
      throw error;
    }
  };

  const handleUpdateChart = async (chartId: string, data: CreateChartData) => {
    try {
      const result = await updateChart({ chartId, data }).unwrap();
      toast.success("Chart updated successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update chart");
      throw error;
    }
  };

  const handleDeleteChart = async (chartId: string) => {
    try {
      await deleteChart(chartId).unwrap();
      toast.success("Chart deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete chart");
      throw error;
    }
  };

  return {
    useGetChartsQuery,
    useGetChartQuery,
    createChart: handleCreateChart,
    updateChart: handleUpdateChart,
    deleteChart: handleDeleteChart,
  };
};