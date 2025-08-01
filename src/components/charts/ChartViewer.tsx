import { useState } from "react";
import { Chart2D } from "./Chart2D";
import { Chart3D } from "./Chart3D";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { CHART_TYPES, CHART_TYPE_LABELS } from "../../lib/constants";
import { formatDate, validateChartData } from "../../lib/utils";
import { MoreVertical, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useCharts } from "../../hooks/useCharts";
import type { Chart } from "../../types";
import { ChartDownload } from "./ChartDownload";

interface ChartViewerProps {
  chart: Chart;
  onEdit?: () => void;
}

export const ChartViewer = ({ chart, onEdit }: ChartViewerProps) => {
  const { deleteChart } = useCharts();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteChart(chart.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting chart:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const is3DChart = [
    CHART_TYPES.COLUMN_3D,
    CHART_TYPES.BAR_3D,
    CHART_TYPES.LINE_3D,
  ].includes(chart.type as typeof CHART_TYPES.COLUMN_3D | typeof CHART_TYPES.BAR_3D | typeof CHART_TYPES.LINE_3D);

  // Validate chart data
  const isValidChart = validateChartData(chart);
  
  // Debug logging
  console.log('Chart in viewer:', chart);
  console.log('Is valid chart:', isValidChart);
  console.log('Chart data:', chart.data);
  console.log('Chart config:', chart.config);

  const renderChart = () => {
    if (!isValidChart) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Chart Data</h3>
            <p className="text-gray-500 mb-4">
              The chart data is missing or invalid. Please check:
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Chart has valid data</li>
              <li>• X-axis and Y-axis are properly configured</li>
              <li>• Data format matches expected structure</li>
            </ul>
          </div>
        </div>
      );
    }

    try {
      if (is3DChart || chart.type === CHART_TYPES.PIE) {
        // Render 3D charts and pie charts as 3D
        return <Chart3D chart={chart} height={400} />;
      } else {
        // Render 2D charts
        return <Chart2D chart={chart} height={400} />;
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return (
        <div className="flex items-center justify-center h-64 text-red-500 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Chart Rendering Error</h3>
            <p className="text-red-600">
              Failed to render chart. Please try refreshing or contact support.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {chart.name || chart.config.title || "Untitled Chart"}
            </CardTitle>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {CHART_TYPE_LABELS[chart.type] || chart.type}
              </Badge>
              <Badge variant={is3DChart ? "default" : "secondary"} className="text-xs">
                {is3DChart ? "3D" : "2D"}
              </Badge>
              {chart.createdAt && (
                <span className="text-xs text-gray-500">
                  Created {formatDate(chart.createdAt, "MMM dd, yyyy")}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChartDownload chart={chart} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="chart-container mb-4">
            {renderChart()}
          </div>
          
          {isValidChart && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Y-Axis:</span>
                  <span>{chart.config.yAxis}</span>
                </div>
                {chart.data?.chartData && (
                  <div className="flex justify-between">
                    <span className="font-medium">Data Points:</span>
                    <span>{chart.data.chartData.length}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{chart.name || chart.config.title || "this chart"}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="bg-red-500"/>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};