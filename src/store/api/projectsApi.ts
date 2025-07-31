import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  ApiResponse,
  CreateProjectData,
  InviteUserData,
  Project,
} from "../../types";

const API_URL =
  import.meta.env.VITE_SERVER_URL ||
  "https://excel-analytics-server.onrender.com";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/projects`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Project", "Projects", "Invitation"],
  endpoints: (builder) => ({
    createProject: builder.mutation<
      ApiResponse<{ project: Project }>,
      CreateProjectData
    >({
      query: (projectData) => ({
        url: "",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Projects"],
    }),
    getUserProjects: builder.query<ApiResponse<{ projects: Project[] }>, void>({
      query: () => "",
      providesTags: ["Projects"],
    }),
    getProject: builder.query<ApiResponse<{ project: Project }>, string>({
      query: (projectId) => `/${projectId}`,
      providesTags: (_, __, projectId) => [
        { type: "Project", id: projectId },
      ],
    }),
    updateProject: builder.mutation<
      ApiResponse<{ project: Project }>,
      { projectId: string; data: { name: string; description?: string } }
    >({
      query: ({ projectId, data }) => ({
        url: `/${projectId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { projectId }) => [
        { type: "Project", id: projectId },
        "Projects",
      ],
    }),
    deleteProject: builder.mutation<ApiResponse, string>({
      query: (projectId) => ({
        url: `/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    inviteUser: builder.mutation<
      ApiResponse<{ email: string; projectId: string; token: string }>,
      { projectId: string; data: InviteUserData }
    >({
      query: ({ projectId, data }) => ({
        url: `/${projectId}/invite`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, __, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),
    getInvitationDetails: builder.query<
      ApiResponse<{
        invitation: {
          email: string;
          role: string;
          expiresAt: string;
          project: {
            id: string;
            name: string;
            description: string;
            type: string;
            creator: {
              firstName: string;
              lastName: string;
              email: string;
            };
          };
        };
      }>,
      string
    >({
      // Changed from `/invitation/${token}` to `/invitations/${token}` to match the URL in browser
      query: (token) => `/invitations/${token}`,
      providesTags: (_, __, token) => [{ type: "Invitation", id: token }],
    }),
    acceptInvitation: builder.mutation<
      ApiResponse<{ project: Project; role: string }>,
      { token: string }
    >({
      query: (data) => ({
        url: "/accept-invitation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects", "Invitation"],
    }),
    removeMember: builder.mutation<
      ApiResponse,
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: `/${projectId}/remove-member`,
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: (_, __, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),
    updateMemberRole: builder.mutation<
      ApiResponse,
      { projectId: string; userId: string; role: string }
    >({
      query: ({ projectId, userId, role }) => ({
        url: `/${projectId}/update-member`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: (_, __, { projectId }) => [
        { type: "Project", id: projectId },
      ],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetUserProjectsQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useInviteUserMutation,
  useGetInvitationDetailsQuery,
  useAcceptInvitationMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} = projectsApi;