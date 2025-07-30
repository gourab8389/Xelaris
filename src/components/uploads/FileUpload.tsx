import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useUploads } from "../../hooks/useUploads";
import { MAX_FILE_SIZE } from "../../lib/constants";
import { formatFileSize } from "../../lib/utils";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  projectId: string;
  onUploadComplete?: () => void;
}

interface UploadFile extends File {
  id: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export const FileUpload = ({ projectId, onUploadComplete }: FileUploadProps) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const { uploadFile } = useUploads();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === "file-too-large") {
          toast.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
        } else if (error.code === "file-invalid-type") {
          toast.error(`File ${file.name} is not a valid Excel file`);
        }
      });
    });

    // Add accepted files to upload queue
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const uploadSingleFile = async (file: UploadFile) => {
    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === file.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      await uploadFile(projectId, file);

      clearInterval(progressInterval);
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "success", progress: 100 }
            : f
        )
      );

      onUploadComplete?.();
    } catch (error: any) {
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: error.message || "Upload failed",
              }
            : f
        )
      );
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadAllFiles = async () => {
    const pendingFiles = uploadFiles.filter((f) => f.status === "pending");
    for (const file of pendingFiles) {
      await uploadSingleFile(file);
    }
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "uploading":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the Excel files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload Excel Files
            </p>
            <p className="text-gray-600 mb-4">
              Drag and drop your Excel files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Supports .xlsx and .xls files up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
        )}
      </div>

      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Files to Upload</h3>
            <Button
              onClick={uploadAllFiles}
              disabled={!uploadFiles.some((f) => f.status === "pending")}
              size="sm"
            >
              Upload All
            </Button>
          </div>

          {uploadFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              {getStatusIcon(file.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                {file.status === "uploading" && (
                  <Progress value={file.progress} className="mt-2" />
                )}
                {file.status === "error" && file.error && (
                  <p className="text-sm text-red-500 mt-1">{file.error}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {file.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => uploadSingleFile(file)}
                  >
                    Upload
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={file.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};