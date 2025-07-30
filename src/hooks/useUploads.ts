import { toast } from "sonner";
import {
  useUploadFileMutation,
  useGetUploadsQuery,
  useGetUploadQuery,
  useDeleteUploadMutation,
} from "../store/api/uploadsApi";

export const useUploads = () => {
  const [uploadFileMutation] = useUploadFileMutation();
  const [deleteUpload] = useDeleteUploadMutation();

  const handleUploadFile = async (projectId: string, file: File) => {
    
    if (!file) {
      console.error('No file provided to upload function');
      toast.error("No file selected");
      throw new Error("No file selected");
    }

    if (!projectId) {
      console.error('No projectId provided');
      toast.error("Project ID is required");
      throw new Error("Project ID is required");
    }
    
    try {
      const result = await uploadFileMutation({ projectId, file }).unwrap();
      toast.success("File uploaded successfully!");
      return result;
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.data?.message || error?.message || "Failed to upload file";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    try {
      await deleteUpload(uploadId).unwrap();
      toast.success("Upload deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete upload");
      throw error;
    }
  };

  return {
    useGetUploadsQuery,
    useGetUploadQuery,
    uploadFile: handleUploadFile,
    deleteUpload: handleDeleteUpload,
  };
};