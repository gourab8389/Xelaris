import { toast } from "sonner";
import {
  useCreateProjectMutation,
  useGetUserProjectsQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useInviteUserMutation,
  useAcceptInvitationMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "../store/api/projectsApi";
import type { CreateProjectData, InviteUserData } from "../types";

export const useProjects = () => {
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [inviteUser] = useInviteUserMutation();
  const [acceptInvitation] = useAcceptInvitationMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  const handleCreateProject = async (data: CreateProjectData) => {
    try {
      const result = await createProject(data).unwrap();
      toast.success("Project created successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create project");
      throw error;
    }
  };

  const handleUpdateProject = async (
    projectId: string,
    data: { name: string; description?: string }
  ) => {
    try {
      const result = await updateProject({ projectId, data }).unwrap();
      toast.success("Project updated successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update project");
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId).unwrap();
      toast.success("Project deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete project");
      throw error;
    }
  };

  const handleInviteUser = async (projectId: string, data: InviteUserData) => {
    try {
      const result = await inviteUser({ projectId, data }).unwrap();
      toast.success("Invitation sent successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send invitation");
      throw error;
    }
  };

  const handleAcceptInvitation = async (token: string) => {
    try {
      await acceptInvitation({ token }).unwrap();
      toast.success("Invitation accepted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to accept invitation");
      throw error;
    }
  };

  const handleRemoveMember = async (projectId: string, userId: string) => {
    try {
      await removeMember({ projectId, userId }).unwrap();
      toast.success("Member removed successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove member");
      throw error;
    }
  };

  const handleUpdateMemberRole = async (
    projectId: string,
    userId: string,
    role: string
  ) => {
    try {
      await updateMemberRole({ projectId, userId, role }).unwrap();
      toast.success("Member role updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update member role");
      throw error;
    }
  };

  return {
    useGetUserProjectsQuery,
    useGetProjectQuery,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    inviteUser: handleInviteUser,
    acceptInvitation: handleAcceptInvitation,
    removeMember: handleRemoveMember,
    updateMemberRole: handleUpdateMemberRole,
  };
};
