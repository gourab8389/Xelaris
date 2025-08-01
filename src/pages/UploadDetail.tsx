import { useParams } from "react-router-dom";
import { useUploads } from "../hooks/useUploads";
import { useCharts } from "../hooks/useCharts";
import { ChartCreator } from "../components/charts/ChartCreator";
import { ChartViewer } from "../components/charts/ChartViewer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { formatDate, formatFileSize, getStatusColor } from "../lib/utils";
import { FileText, BarChart3 } from "lucide-react";

export const UploadDetail = () => {
  const { uploadId } = useParams<{ uploadId: string }>();
  const { useGetUploadQuery } = useUploads();
  const { useGetChartsQuery } = useCharts();

  const { data: uploadData, isLoading: isUploadLoading } = useGetUploadQuery(uploadId!);
  const { data: chartsData, isLoading: isChartsLoading, refetch: refetchCharts } = useGetChartsQuery(uploadId!);

  if (isUploadLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!uploadData?.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Upload not found</p>
      </div>
    );
  }

  const upload = uploadData.data?.upload;
  const excelData = upload?.data?.[0];
  const charts = chartsData?.data?.charts || [];

  return (
    <div className="space-y-6">
      {/* Upload Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{upload?.originalName}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(upload?.status ?? "")}>
                {upload?.status.toLowerCase()}
              </Badge>
              <span className="text-gray-600">
                {formatFileSize(upload?.fileSize ?? 0)} • Uploaded {formatDate(upload?.uploadedAt ?? "")}
              </span>
            </div>
          </div>
        </div>
        {excelData && upload?.status === "COMPLETED" && (
          <ChartCreator
            uploadId={upload?.id}
            excelData={excelData}
            onChartCreated={refetchCharts}
          />
        )}
      </div>

      {/* Data Preview */}
      {excelData && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              {excelData.metadata.totalRows} rows × {excelData.metadata.totalColumns} columns
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {excelData.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.rows.slice(0, 5).map((row: any, index) => (
                    <tr key={index} className="border-b">
                      {excelData.headers.map((header, colIndex) => (
                        <td key={colIndex} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {row[header]?.toString() || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {excelData.rows.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing first 5 rows of {excelData.rows.length} total rows
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Charts ({charts.length})</h2>
        </div>

        {isChartsLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : charts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No charts created yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {charts.map((chart) => (
              <ChartViewer key={chart.id} chart={chart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};