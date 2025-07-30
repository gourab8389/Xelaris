import { toast } from "sonner";
import {
  useUploadFileMutation,
  useGetUploadsQuery,
  useGetUploadQuery,
  useDeleteUploadMutation,
} from "../store/api/uploadsApi";

export const useUploads = () => {
  const [uploadFile] = useUploadFileMutation();
  const [deleteUpload] = useDeleteUploadMutation();

  const handleUploadFile = async (projectId: string, file: File) => {
    try {
      const result = await uploadFile({ projectId, file }).unwrap();
      toast.success("File uploaded successfully!");
      return result;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload file");
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