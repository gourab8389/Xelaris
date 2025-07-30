import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "../../lib/utils";
import { FolderOpen, Users, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types";

interface RecentProjectsProps {
  projects: Project[];
}

export const RecentProjects = ({ projects }: RecentProjectsProps) => {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No projects yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <Link
                    to={`/project/${project.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {project.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatDate(project.createdAt, "MMM dd")}</span>
                    {project.description && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-40">{project.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={project.role === "ADMIN" ? "default" : "secondary"}>
                  {project.role?.toLowerCase()}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {project.memberCount !== undefined && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {project.memberCount}
                    </div>
                  )}
                  {project.uploadCount !== undefined && (
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-1" />
                      {project.uploadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};