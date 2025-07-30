import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { ApiResponse, Chart, CreateChartData } from "../../types";

const API_URL = import.meta.env.VITE_SERVER_URL || "https://excel-analytics-server.onrender.com";

export const chartsApi = createApi({
  reducerPath: "chartsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/charts`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Chart", "Charts"],
  endpoints: (builder) => ({
    createChart: builder.mutation<
      ApiResponse<{ chart: Chart }>,
      { uploadId: string; data: CreateChartData }
    >({
      query: ({ uploadId, data }) => ({
        url: `/upload/${uploadId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Charts"],
    }),
    getCharts: builder.query<ApiResponse<{ charts: Chart[] }>, string>({
      query: (uploadId) => `/upload/${uploadId}`,
      providesTags: ["Charts"],
    }),
    getChart: builder.query<ApiResponse<{ chart: Chart }>, string>({
      query: (chartId) => `/${chartId}`,
      providesTags: (_, __, chartId) => [{ type: "Chart", id: chartId }],
    }),
    updateChart: builder.mutation<
      ApiResponse<{ chart: Chart }>,
      { chartId: string; data: CreateChartData }
    >({
      query: ({ chartId, data }) => ({
        url: `/${chartId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { chartId }) => [
        { type: "Chart", id: chartId },
        "Charts",
      ],
    }),
    deleteChart: builder.mutation<ApiResponse, string>({
      query: (chartId) => ({
        url: `/${chartId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Charts"],
    }),
  }),
});

export const {
  useCreateChartMutation,
  useGetChartsQuery,
  useGetChartQuery,
  useUpdateChartMutation,
  useDeleteChartMutation,
} = chartsApi;