import { store } from '../store';
import { projectsApi } from '../store/api/projectsApi';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const handlePendingInvitation = async () => {
  const pendingToken = localStorage.getItem('pendingInvitationToken');
  const authToken = Cookies.get('token');
  
  if (!pendingToken || !authToken) {
    return null;
  }

  try {
    // Use RTK Query mutation directly
    const result = await store.dispatch(
      projectsApi.endpoints.acceptInvitation.initiate({ token: pendingToken })
    ).unwrap();

    if (result.success) {
      // Clear the pending token
      localStorage.removeItem('pendingInvitationToken');
      
      return {
        success: true,
        project: result.data?.project,
        message: 'Invitation accepted successfully!'
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to accept invitation'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.data?.message || 'Failed to accept invitation. Please try again.'
    };
  }
};

export const checkAndHandlePendingInvitation = async (
  navigate: (path: string) => void
) => {
  const result = await handlePendingInvitation();
  
  if (result) {
    if (result.success) {
      toast.success(result.message);
      // Redirect to the project
      navigate(`/project/${result.project?.id}`);
    } else {
      toast.error(result.message);
      // Redirect to dashboard
      navigate('/dashboard');
    }
    return true; // Indicates there was a pending invitation
  }
  
  return false; // No pending invitation
};

export const hasPendingInvitation = (): boolean => {
  return !!localStorage.getItem('pendingInvitationToken');
};