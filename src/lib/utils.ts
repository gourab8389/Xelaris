import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = "PPP") {
  return format(new Date(date), formatStr);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function downloadFile(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100";
    case "processing":
      return "text-yellow-600 bg-yellow-100";
    case "failed":
      return "text-red-600 bg-red-100";
    case "pending":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}


export const generateRandomColor = (alpha: number = 0.8): string => {
  const colors = [
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 205, 86, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
    `rgba(199, 199, 199, ${alpha})`,
    `rgba(83, 102, 255, ${alpha})`,
    `rgba(255, 99, 255, ${alpha})`,
    `rgba(99, 255, 132, ${alpha})`,
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

export const processChartData = (rawData: any[], xAxis: string, yAxis: string) => {
  if (!rawData || !rawData.length) {
    return [];
  }

  // Handle different data structures
  return rawData.map((item: any) => {
    // Handle the case where data might have different property names
    const xValue = item[xAxis] || item.x || item.label || 'Unknown';
    const yValue = item[yAxis] || item.y || 0;
    
    return {
      [xAxis]: xValue,
      [yAxis]: typeof yValue === 'number' ? yValue : (yValue === 'undefined' ? 1 : Number(yValue) || 1),
      x: xValue,
      y: typeof yValue === 'number' ? yValue : 1,
      label: xValue
    };
  });
};

export const aggregateDataForPieChart = (data: any[], xAxis: string): any[] => {
  const aggregated: { [key: string]: number } = {};
  
  data.forEach(item => {
    const key = item[xAxis] || item.x || item.label || 'Unknown';
    aggregated[key] = (aggregated[key] || 0) + 1;
  });
  
  return Object.entries(aggregated).map(([key, value]) => ({
    [xAxis]: key,
    count: value,
    x: key,
    y: value,
    label: key
  }));
};

export const validateChartData = (chart: any): boolean => {
  if (!chart || !chart.data) {
    console.error('Chart or chart data is missing');
    return false;
  }
  
  if (!chart.config || !chart.config.xAxis || !chart.config.yAxis) {
    console.error('Chart config or axis configuration is missing');
    return false;
  }
  
  const chartData = chart.data.chartData || [];
  if (!Array.isArray(chartData) || chartData.length === 0) {
    console.error('Chart data is empty or not an array');
    return false;
  }
  
  return true;
};

export const getChartDisplayData = (chart: any) => {
  if (!validateChartData(chart)) {
    return null;
  }
  
  const { data, config, type } = chart;
  const rawData = data.chartData || [];
  
  // If we already have processed chart config data, use it
  if (data.chartConfig?.data) {
    return data.chartConfig.data;
  }
  
  // Process raw data based on chart type
  let processedData;
  
  if (type === 'PIE') {
    processedData = aggregateDataForPieChart(rawData, config.xAxis);
  } else {
    processedData = processChartData(rawData, config.xAxis, config.yAxis);
  }
  
  return {
    processedData,
    labels: processedData.map(item => item[config.xAxis] || item.x || item.label),
    values: processedData.map(item => item[config.yAxis] || item.y || item.count || 1)
  };
};