import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import {
  useGetInvitationDetailsQuery,
  useAcceptInvitationMutation,
} from '../store/api/projectsApi';

const InvitationPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const isAuthenticated = !!Cookies.get('token');

  // RTK Query hooks
  const {
    data: invitationData,
    isLoading,
    error: invitationError,
  } = useGetInvitationDetailsQuery(token || '', {
    skip: !token,
  });

  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();

  useEffect(() => {
    if (!token) {
      navigate('/dashboard');
      return;
    }
  }, [token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      // Store the token for use after login
      localStorage.setItem('pendingInvitationToken', token || '');
      // Redirect to login page with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!token) return;

    try {
      const result = await acceptInvitation({ token }).unwrap();
      
      toast.success('Invitation accepted successfully!');
      if (result.data && result.data.project && result.data.project.id) {
        navigate(`/project/${result.data.project.id}`);
      } else {
        toast.error('Project information is missing in the response.');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to accept invitation';
      toast.error(errorMessage);
    }
  };

  const handleLogin = () => {
    localStorage.setItem('pendingInvitationToken', token || '');
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const handleRegister = () => {
    localStorage.setItem('pendingInvitationToken', token || '');
    navigate(`/register?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invitation details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (invitationError || !invitationData?.success) {
    const errorMessage = invitationError 
      ? 'data' in invitationError 
        ? (invitationError.data as any)?.message || 'Failed to load invitation'
        : 'Network error'
      : invitationData?.message || 'Invalid invitation';

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const invitation = invitationData.data?.invitation;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900">You're Invited!</h1>
          </div>

          {/* Invitation Details */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Project Details</h3>
              <p className="text-blue-800">
                <span className="font-medium">Project:</span> {invitation?.project.name}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Invited by:</span>{' '}
                {invitation?.project.creator.firstName} {invitation?.project.creator.lastName}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Role:</span> {invitation?.role}
              </p>
            </div>

            {invitation?.project.description && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">About this project:</h4>
                <p className="text-gray-700 text-sm">{invitation?.project.description}</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <span className="font-medium">Note:</span> This invitation expires on{' '}
                {new Date(invitation?.expiresAt ?? '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isAuthenticated ? (
              <button
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Accepting...
                  </span>
                ) : (
                  'Accept Invitation'
                )}
              </button>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    You need to be logged in to accept this invitation
                  </p>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Login to Accept
                </button>
                
                <div className="text-center">
                  <span className="text-gray-500 text-sm">Don't have an account? </span>
                  <button
                    onClick={handleRegister}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Sign up first
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Excel Analytics Platform - Collaborate on data analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;