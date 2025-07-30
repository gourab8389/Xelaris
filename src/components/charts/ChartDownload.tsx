import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Download, FileImage, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Chart } from "../../types";

interface ChartDownloadProps {
  chart: Chart;
}

export const ChartDownload = ({ chart }: ChartDownloadProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      // Find the chart canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        toast.error("Chart not found for download");
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `${chart.name || 'chart'}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Chart downloaded as PNG");
    } catch (error) {
      toast.error("Failed to download chart");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      // This would require a PDF library like jsPDF
      // For now, we'll show a placeholder
      toast.info("PDF download feature coming soon");
    } catch (error) {
      toast.error("Failed to download chart as PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDownloading}>
          <Download className="h-4 w-4 mr-1" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadAsPNG}>
          <FileImage className="mr-2 h-4 w-4" />
          Download as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadAsPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};