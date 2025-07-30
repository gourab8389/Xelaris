import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { ApiResponse, ExcelData, Upload } from "../../types";

const API_URL = import.meta.env.VITE_SERVER_URL || "https://excel-analytics-server.onrender.com";

export const uploadsApi = createApi({
  reducerPath: "uploadsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/uploads`,
    prepareHeaders: (headers, { endpoint }) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      // Don't set content-type for file uploads, let the browser set it
      if (endpoint === "uploadFile") {
        // Remove content-type to let browser set multipart/form-data
        headers.delete("content-type");
      }
      return headers;
    },
  }),
  tagTypes: ["Upload", "Uploads"],
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      ApiResponse<{ upload: Upload; data: ExcelData }>,
      { projectId: string; file: File }
    >({
      query: ({ projectId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/${projectId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Uploads"],
    }),
    getUploads: builder.query<ApiResponse<{ uploads: Upload[] }>, string>({
      query: (projectId) => `/${projectId}`,
      providesTags: ["Uploads"],
    }),
    getUpload: builder.query<ApiResponse<{ upload: Upload }>, string>({
      query: (uploadId) => `/file/${uploadId}`,
      providesTags: (_, __, uploadId) => [{ type: "Upload", id: uploadId }],
    }),
    deleteUpload: builder.mutation<ApiResponse, string>({
      query: (uploadId) => ({
        url: `/file/${uploadId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Uploads"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetUploadsQuery,
  useGetUploadQuery,
  useDeleteUploadMutation,
} = uploadsApi;