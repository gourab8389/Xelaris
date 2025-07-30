import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { AuthResponse, DashboardData, LoginData, RegisterData, User } from "../../types";

const API_URL = import.meta.env.VITE_SERVER_URL || "https://excel-analytics-server.onrender.com";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/auth`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Dashboard"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginData>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    getProfile: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => "/profile",
      providesTags: ["User"],
    }),
    getDashboard: builder.query<{ success: boolean; data: DashboardData }, void>({
      query: () => ({
        url: "/users/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetDashboardQuery,
} = authApi;