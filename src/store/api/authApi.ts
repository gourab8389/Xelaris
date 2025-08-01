import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { AuthResponse, DashboardData, LoginData, RegisterData, User } from "../../types";

const API_URL = import.meta.env.VITE_SERVER_URL || "https://excel-analytics-server.onrender.com";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
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
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<
      { success: boolean; message: string; data: { user: User } }, 
      Partial<Pick<User, 'firstName' | 'lastName'>>
    >({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
      // Optimistic update
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('getProfile', undefined, (draft) => {
            if (draft.data?.user) {
              Object.assign(draft.data.user, patch);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Dashboard"],
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
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useGetDashboardQuery,
} = authApi;