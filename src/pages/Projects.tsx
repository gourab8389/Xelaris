import { useProjects } from "../hooks/useProjects";
import { CreateProjectForm } from "../components/projects/CreateProjectForm";
import { ProjectCard } from "../components/projects/ProjectCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const Projects = () => {
  const { useGetUserProjectsQuery } = useProjects();
  const { data, isLoading, error } = useGetUserProjectsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load projects</p>
      </div>
    );
  }

  const projects = data?.data?.projects || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your Excel analytics projects</p>
        </div>
        <CreateProjectForm />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Create your first project to get started</p>
          <CreateProjectForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};