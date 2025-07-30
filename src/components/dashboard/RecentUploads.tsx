
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate, formatFileSize, getStatusColor } from "../../lib/utils";
import { FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Upload } from "../../types";

interface RecentUploadsProps {
  uploads: Upload[];
}

export const RecentUploads = ({ uploads }: RecentUploadsProps) => {
  if (uploads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No uploads yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <Link
                    to={`/upload/${upload.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {upload.originalName}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatFileSize(upload.fileSize)}</span>
                    <span>•</span>
                    <span>{upload.project?.name}</span>
                    <span>•</span>
                    <span>{formatDate(upload.uploadedAt, "MMM dd")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(upload.status)}>
                  {upload.status.toLowerCase()}
                </Badge>
                {upload._count && upload._count.charts > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {upload._count.charts}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};