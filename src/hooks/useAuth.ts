import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCredentials,
  logout,
  setLoading,
  setUser,
} from "../store/slices/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from "../store/api/authApi";
import { toast } from "sonner";
import type { LoginData, RegisterData, User } from "../types";
import type { RootState } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [deleteAccountMutation] = useDeleteAccountMutation();

  useEffect(() => {
    if (profileData?.success && profileData?.data?.user) {
      dispatch(setUser(profileData.data.user));
    }
  }, [profileData, dispatch]);

  const login = async (credentials: LoginData) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials(result.data));
      toast.success("Login successful!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch(setLoading(true));
      const result = await registerMutation(userData).unwrap();
      dispatch(setCredentials(result.data));
      toast.success("Registration successful!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const result = await updateProfileMutation(userData).unwrap();
      dispatch(setUser(result.data));
      toast.success("Profile updated successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Profile update failed");
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const result = await deleteAccountMutation().unwrap();
      dispatch(logout());
      toast.success("Account deleted successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Account deletion failed");
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
    refetchProfile,
    updateProfile,
    deleteAccount,
  };
};
