import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDate } from "../../lib/utils";
import {
  FolderOpen,
  Users,
  Upload,
  MoreVertical,
  Settings,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import type { Project } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { deleteProject } = useProjects();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-3">
            <FolderOpen className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle className="text-lg">
                <Link
                  to={`/project/${project.id}`}
                  className="hover:text-blue-600"
                >
                  {project.name}
                </Link>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={
                    project.type === "ORGANIZATION" ? "default" : "secondary"
                  }
                >
                  {project.type.toLowerCase()}
                </Badge>
                <Badge
                  variant={project.role === "ADMIN" ? "default" : "outline"}
                >
                  {project.role?.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/project/${project.id}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              {project.role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-white"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {project.description && (
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {project.memberCount !== undefined && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {project.memberCount} members
                </div>
              )}
              {project.uploadCount !== undefined && (
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  {project.uploadCount} uploads
                </div>
              )}
            </div>
            <span>{formatDate(project.createdAt, "MMM dd, yyyy")}</span>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
