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
    const chartData = data.chartData || [];

    if (!chartData.length) {
      return { labels: [], datasets: [] };
    }

    const labels = chartData.map((item: any) => item[config.xAxis]);
    const values = chartData.map((item: any) => item[config.yAxis]);

    if (chart.type === CHART_TYPES.PIE) {
      return {
        labels,
        datasets: [
          {
            label: config.yAxis,
            data: values,
            backgroundColor: labels.map(() => generateRandomColor()),
            borderWidth: 1,
          },
        ],
      };
    }

    if (chart.type === CHART_TYPES.SCATTER) {
      return {
        datasets: [
          {
            label: `${config.xAxis} vs ${config.yAxis}`,
            data: chartData.map((item: any) => ({
              x: item[config.xAxis],
              y: item[config.yAxis],
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
          label: config.yAxis,
          data: values,
          backgroundColor: generateRandomColor(),
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
          },
        },
      };
    }

    return baseOptions;
  };

  const renderChart = () => {
    const data = prepareChartData();
    const options = getChartOptions();

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
        return <div className="flex items-center justify-center h-64 text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      {renderChart()}
    </div>
  );
};