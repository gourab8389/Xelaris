import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { generateRandomColor } from "../../lib/utils";
import { CHART_TYPES } from "../../lib/constants";
import type { Chart } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Chart2DProps {
  chart: Chart;
  height?: number;
}

export const Chart2D = ({ chart, height = 400 }: Chart2DProps) => {
  const chartRef = useRef<any>(null);

  const prepareChartData = () => {
    const { data, config } = chart;
    
    // Check if we have chartConfig (pre-processed data from API)
    if (data?.chartConfig?.data) {
      return data.chartConfig.data;
    }
    
    // Fallback to processing chartData
    const chartData = data?.chartData || [];

    if (!chartData.length) {
      return { labels: [], datasets: [] };
    }

    // For PIE charts, we need to process the data differently
    if (chart.type === CHART_TYPES.PIE) {
      // Count occurrences of each category
      const categoryCount: { [key: string]: number } = {};
      chartData.forEach((item: any) => {
        const category = item[config.xAxis] || item.x || item.label;
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      const labels = Object.keys(categoryCount);
      const values = Object.values(categoryCount);

      return {
        labels,
        datasets: [
          {
            label: config.yAxis || config.xAxis,
            data: values,
            backgroundColor: labels.map(() => generateRandomColor()),
            borderWidth: 1,
          },
        ],
      };
    }

    // For other chart types
    const labels = chartData.map((item: any) => 
      item[config.xAxis] || item.x || item.label || 'Unknown'
    );
    
    const values = chartData.map((item: any) => {
      const value = item[config.yAxis] || item.y;
      return typeof value === 'number' ? value : 1; // Default to 1 if not a number
    });

    if (chart.type === CHART_TYPES.SCATTER) {
      return {
        datasets: [
          {
            label: `${config.xAxis} vs ${config.yAxis}`,
            data: chartData.map((item: any) => ({
              x: item[config.xAxis] || item.x || 0,
              y: item[config.yAxis] || item.y || 0,
            })),
            backgroundColor: generateRandomColor(),
            borderColor: generateRandomColor(),
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: config.yAxis || 'Value',
          data: values,
          backgroundColor: chart.type === CHART_TYPES.LINE 
            ? generateRandomColor() 
            : labels.map(() => generateRandomColor()),
          borderColor: generateRandomColor(),
          borderWidth: 1,
          tension: chart.type === CHART_TYPES.LINE ? 0.4 : undefined,
        },
      ],
    };
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: !!chart.config.title,
          text: chart.config.title,
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    if (chart.type === CHART_TYPES.SCATTER) {
      return {
        ...baseOptions,
        scales: {
          x: {
            type: "linear" as const,
            position: "bottom" as const,
            title: {
              display: true,
              text: chart.config.xAxis,
            },
          },
          y: {
            title: {
              display: true,
              text: chart.config.yAxis,
            },
          },
        },
      };
    }

    if (chart.type !== CHART_TYPES.PIE) {
      return {
        ...baseOptions,
        scales: {
          x: {
            title: {
              display: true,
              text: chart.config.xAxis,
            },
          },
          y: {
            title: {
              display: true,
              text: chart.config.yAxis,
            },
            beginAtZero: true,
          },
        },
      };
    }

    return baseOptions;
  };

  const renderChart = () => {
    const data = prepareChartData();
    const options = getChartOptions();

    // Debug logging
    console.log('Chart Type:', chart.type);
    console.log('Chart Data:', data);
    console.log('Chart Options:', options);

    // Check if we have valid data
    if (!data.labels?.length && !data.datasets?.length) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Please check your data source</p>
          </div>
        </div>
      );
    }

    switch (chart.type) {
      case CHART_TYPES.BAR:
        return <Bar ref={chartRef} data={data} options={options} height={height} />;
      case CHART_TYPES.LINE:
        return <Line ref={chartRef} data={data} options={options} height={height} />;
      case CHART_TYPES.PIE:
        return <Pie ref={chartRef} data={data} options={options} height={height} />;
      case CHART_TYPES.SCATTER:
        return <Scatter ref={chartRef} data={data} options={options} height={height} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-medium">Unsupported chart type: {chart.type}</p>
              <p className="text-sm">Please select a different chart type</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4" style={{ height: `${height}px` }}>
      {renderChart()}
    </div>
  );
};