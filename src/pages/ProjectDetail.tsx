import { useParams } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { useUploads } from "../hooks/useUploads";
import { InviteUserForm } from "../components/projects/InviteUserForm";
import { FileUpload } from "../components/uploads/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { formatDate, formatFileSize, getStatusColor } from "../lib/utils";
import { FolderOpen, Upload, Users, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { useGetProjectQuery } = useProjects();
  const { useGetUploadsQuery } = useUploads();

  const { data: projectData, isLoading: isProjectLoading } = useGetProjectQuery(projectId!);
  const { data: uploadsData, isLoading: isUploadsLoading, refetch: refetchUploads } = useGetUploadsQuery(projectId!);

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!projectData?.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Project not found</p>
      </div>
    );
  }

  const project = projectData.data?.project;
  const uploads = uploadsData?.data?.uploads || [];

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FolderOpen className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={project?.type === "ORGANIZATION" ? "default" : "secondary"}>
                {project?.type.toLowerCase()}
              </Badge>
              <span className="text-gray-600">
                Created {project?.createdAt ? formatDate(project.createdAt) : "Unknown date"}
              </span>
            </div>
          </div>
        </div>
        {project?.type === "ORGANIZATION" && (
          <InviteUserForm projectId={project?.id} />
        )}
      </div>

      {project?.description && (
        <p className="text-gray-600">{project?.description}</p>
      )}

      <Tabs defaultValue="uploads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="uploads" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Uploads ({uploads.length})</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Members ({project?.members?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Excel Files</CardTitle>
            </CardHeader>
            <CardContent>
              {project?.id && (
                <FileUpload projectId={project.id} onUploadComplete={refetchUploads} />
              )}
            </CardContent>
          </Card>

          {isUploadsLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : uploads.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No files uploaded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {uploads.map((upload) => (
                <Card key={upload.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <Link
                            to={`/upload/${upload.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {upload.originalName}
                          </Link>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{formatFileSize(upload.fileSize)}</span>
                            <span>•</span>
                            <span>{formatDate(upload.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(upload.status)}>
                          {upload.status.toLowerCase()}
                        </Badge>
                        {upload._count && upload._count.charts > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            {upload._count.charts}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
            </CardHeader>
            <CardContent>
              {project?.members && project?.members.length > 0 ? (
                <div className="space-y-3">
                  {project?.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                          {member.role.toLowerCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Joined {formatDate(member.joinedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No members yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};