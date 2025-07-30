import { Chart2D } from "./Chart2D";
import { Chart3D } from "./Chart3D";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CHART_TYPES, CHART_TYPE_LABELS } from "../../lib/constants";
import { formatDate } from "../../lib/utils";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useCharts } from "../../hooks/useCharts";
import type { Chart, ChartType } from "../../types";

interface ChartViewerProps {
  chart: Chart;
  onEdit?: () => void;
}

export const ChartViewer = ({ chart, onEdit }: ChartViewerProps) => {
  const { deleteChart } = useCharts();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this chart?")) {
      try {
        await deleteChart(chart.id);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const is3DChart = [
    CHART_TYPES.COLUMN_3D,
    CHART_TYPES.BAR_3D,
    CHART_TYPES.LINE_3D,
  ].includes(chart.type as typeof CHART_TYPES.COLUMN_3D | typeof CHART_TYPES.BAR_3D | typeof CHART_TYPES.LINE_3D);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">
            {chart.name || chart.config.title || "Untitled Chart"}
          </CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">
              {CHART_TYPE_LABELS[chart.type]}
            </Badge>
            <Badge variant={is3DChart ? "default" : "secondary"}>
              {is3DChart ? "3D" : "2D"}
            </Badge>
            <span className="text-sm text-gray-500">
              Created {formatDate(chart.createdAt, "MMM dd, yyyy")}
            </span>
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
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {is3DChart ? (
            <Chart3D chart={chart} height={400} />
          ) : (
            <Chart2D chart={chart} height={400} />
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>X-Axis:</strong> {chart.config.xAxis} | 
            <strong> Y-Axis:</strong> {chart.config.yAxis}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};