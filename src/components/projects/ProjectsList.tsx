import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Loader2, RefreshCw } from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectDialog from "./ProjectDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface ProjectsListProps {
  onViewProject: (projectId: string) => void;
  onManageSubscription: (projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  onViewProject,
  onManageSubscription,
}) => {
  // Define a proper type for projects
  interface Project {
    id: string;
    name: string;
    description?: string;
    project_type: string;
    status: string;
    created_at: string;
    updated_at: string;
    token_symbol?: string;
    target_raise?: number;
    authorized_shares?: number;
    share_price?: number;
    company_valuation?: number;
    funding_round?: string;
    legal_entity?: string;
    jurisdiction?: string;
    tax_id?: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectStats, setProjectStats] = useState<Record<string, any>>({});
  const { toast } = useToast();

  // Fetch projects from Supabase
  useEffect(() => {
    fetchProjects();

    // Set up a cleanup function
    return () => {
      // Cancel any pending operations if component unmounts
      setIsLoading(false);
      setIsProcessing(false);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching projects...");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} projects`);
      setProjects(data || []);

      // Fetch stats for each project
      if (data && data.length > 0) {
        const statsMap: Record<string, any> = {};

        for (const project of data) {
          // Get investor count
          const { count: investorCount, error: countError } = await supabase
            .from("subscriptions")
            .select("investor_id", { count: "exact", head: true })
            .eq("project_id", project.id);

          if (countError) {
            console.error("Error fetching investor count:", countError);
          }

          // Get total raised
          const { data: subscriptions, error: subError } = await supabase
            .from("subscriptions")
            .select("fiat_amount")
            .eq("project_id", project.id);

          if (subError) {
            console.error("Error fetching subscriptions:", subError);
          }

          const totalRaised =
            subscriptions?.reduce(
              (sum, sub) => sum + (sub.fiat_amount || 0),
              0,
            ) || 0;

          statsMap[project.id] = {
            totalInvestors: investorCount || 0,
            totalRaised,
          };
        }

        setProjectStats(statsMap);
      }

      setError(null);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(`Failed to load projects: ${err.message || "Unknown error"}`);
      toast({
        title: "Error",
        description: `Failed to load projects: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter && statusFilter !== "all"
        ? project.status === statusFilter
        : true;
    const matchesType =
      typeFilter && typeFilter !== "all"
        ? project.project_type === typeFilter
        : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle adding a new project
  const handleAddProject = async (projectData: any) => {
    try {
      setIsProcessing(true);

      const now = new Date().toISOString();

      // Prepare the project data with required fields
      const projectPayload = {
        name: projectData.name,
        project_type:
          projectData.project_type || projectData.projectType || "equity",
        description: projectData.description || "",
        status: projectData.status || "draft",
        created_at: now,
        updated_at: now,
        token_symbol: projectData.token_symbol || null,
        target_raise: projectData.target_raise || null,
        authorized_shares: projectData.authorized_shares || null,
        share_price: projectData.share_price || null,
        company_valuation: projectData.company_valuation || null,
        funding_round: projectData.funding_round || null,
        legal_entity: projectData.legal_entity || null,
        jurisdiction: projectData.jurisdiction || null,
        tax_id: projectData.tax_id || null,
      };

      console.log("Creating project with data:", projectPayload);

      // First, check if a project with the same name already exists
      const { data: existingProject, error: checkError } = await supabase
        .from("projects")
        .select("id")
        .eq("name", projectData.name)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking for existing project:", checkError);
        throw checkError;
      }

      if (existingProject) {
        throw new Error(
          `A project with the name '${projectData.name}' already exists`,
        );
      }

      const { data, error } = await supabase
        .from("projects")
        .insert(projectPayload)
        .select()
        .single();

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      console.log("Project created successfully:", data);

      // Create a cap table for this project
      const { error: capTableError } = await supabase
        .from("cap_tables")
        .insert({
          project_id: data.id,
          name: `Cap Table - ${data.name}`,
          created_at: now,
          updated_at: now,
          description: null,
        });

      if (capTableError) {
        console.error("Cap table creation error:", capTableError);
        // If cap table creation fails, delete the project to maintain data integrity
        const { error: deleteError } = await supabase
          .from("projects")
          .delete()
          .eq("id", data.id);

        if (deleteError) {
          console.error(
            "Failed to clean up project after cap table error:",
            deleteError,
          );
        }
        throw capTableError;
      }

      setProjects((prev) => [data, ...prev]);

      // Initialize stats for the new project
      setProjectStats((prev) => ({
        ...prev,
        [data.id]: { totalInvestors: 0, totalRaised: 0 },
      }));

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("Error adding project:", err);
      toast({
        title: "Error",
        description: `Failed to create project: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle editing a project
  const handleEditProject = async (projectData: any) => {
    if (!currentProject) return;

    try {
      setIsProcessing(true);

      // Prepare the update payload
      const updatePayload = {
        ...projectData,
        updated_at: new Date().toISOString(),
      };

      console.log(
        "Updating project with ID:",
        currentProject.id,
        "Data:",
        updatePayload,
      );

      // Check if name is being changed and if so, check for duplicates
      if (projectData.name !== currentProject.name) {
        const { data: existingProject, error: checkError } = await supabase
          .from("projects")
          .select("id")
          .eq("name", projectData.name)
          .not("id", "eq", currentProject.id)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking for existing project:", checkError);
          throw checkError;
        }

        if (existingProject) {
          throw new Error(
            `A project with the name '${projectData.name}' already exists`,
          );
        }
      }

      const { data, error } = await supabase
        .from("projects")
        .update(updatePayload)
        .eq("id", currentProject.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error details:", error);
        throw error;
      }

      console.log("Project updated successfully:", data);

      // If project name was updated, update the cap table name as well
      if (projectData.name !== currentProject.name) {
        const { data: capTable, error: getCapTableError } = await supabase
          .from("cap_tables")
          .select("id, name")
          .eq("project_id", currentProject.id)
          .maybeSingle();

        if (!getCapTableError && capTable) {
          // Only update if the cap table name follows the standard format
          if (capTable.name === `Cap Table - ${currentProject.name}`) {
            const { error: updateCapTableError } = await supabase
              .from("cap_tables")
              .update({
                name: `Cap Table - ${data.name}`,
                updated_at: new Date().toISOString(),
              })
              .eq("id", capTable.id);

            if (updateCapTableError) {
              console.error(
                "Error updating cap table name:",
                updateCapTableError,
              );
              // Non-blocking error - don't throw
            }
          }
        }
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === currentProject.id ? data : project,
        ),
      );

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setIsEditDialogOpen(false);
      setCurrentProject(null);
    } catch (err: any) {
      console.error("Error updating project:", err);
      toast({
        title: "Error",
        description: `Failed to update project: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async () => {
    if (!currentProject) return;

    try {
      setIsProcessing(true);
      console.log("Deleting project with ID:", currentProject.id);

      // Start a transaction by using RPC if available, or handle sequentially
      // First, check if the project has any dependencies that would prevent deletion
      let hasBlockingDependencies = false;
      let blockingMessage = "";

      // Get the cap table for this project
      const { data: capTable, error: capTableError } = await supabase
        .from("cap_tables")
        .select("id")
        .eq("project_id", currentProject.id)
        .maybeSingle();

      if (capTableError) {
        console.error("Error fetching cap table:", capTableError);
        throw capTableError;
      }

      // Get subscriptions for this project
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("project_id", currentProject.id);

      if (subscriptionsError) {
        console.error("Error fetching subscriptions:", subscriptionsError);
        throw subscriptionsError;
      }

      // Delete in the correct order to maintain referential integrity
      // 1. First delete token allocations if they exist
      if (subscriptions && subscriptions.length > 0) {
        console.log("Found subscriptions to delete:", subscriptions.length);
        const subscriptionIds = subscriptions.map((sub) => sub.id);

        // Delete token allocations
        const { error: allocationsError } = await supabase
          .from("token_allocations")
          .delete()
          .in("subscription_id", subscriptionIds);

        if (allocationsError) {
          console.error("Error deleting token allocations:", allocationsError);
          throw allocationsError;
        }

        // 2. Delete subscriptions
        const { error: deleteSubscriptionsError } = await supabase
          .from("subscriptions")
          .delete()
          .eq("project_id", currentProject.id);

        if (deleteSubscriptionsError) {
          console.error(
            "Error deleting subscriptions:",
            deleteSubscriptionsError,
          );
          throw deleteSubscriptionsError;
        }
      }

      // 3. Delete cap table investors if they exist
      if (capTable) {
        console.log("Found cap table to delete:", capTable.id);
        // Delete cap table investors
        const { error: investorsError } = await supabase
          .from("cap_table_investors")
          .delete()
          .eq("cap_table_id", capTable.id);

        if (investorsError) {
          console.error("Error deleting cap table investors:", investorsError);
          throw investorsError;
        }

        // 4. Delete cap table
        const { error: deleteCapTableError } = await supabase
          .from("cap_tables")
          .delete()
          .eq("id", capTable.id);

        if (deleteCapTableError) {
          console.error("Error deleting cap table:", deleteCapTableError);
          throw deleteCapTableError;
        }
      }

      // 5. Finally delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", currentProject.id);

      if (error) {
        console.error("Error deleting project:", error);
        throw error;
      }

      console.log("Project deleted successfully");

      // Update local state
      setProjects((prev) =>
        prev.filter((project) => project.id !== currentProject.id),
      );

      // Update project stats
      setProjectStats((prev) => {
        const newStats = { ...prev };
        delete newStats[currentProject.id];
        return newStats;
      });

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setCurrentProject(null);
    } catch (err: any) {
      console.error("Error deleting project:", err);
      toast({
        title: "Error",
        description: `Failed to delete project: ${err.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setStatusFilter(null);
    setTypeFilter(null);
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your token issuance projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchProjects}
            disabled={isLoading}
            title="Refresh projects"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setCurrentProject(null);
              setIsAddDialogOpen(true);
            }}
            disabled={isProcessing}
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter || ""}
            onValueChange={(value) => setStatusFilter(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={typeFilter || ""}
            onValueChange={(value) => setTypeFilter(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="token">Token</SelectItem>
              <SelectItem value="debt">Debt</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter || typeFilter || searchQuery) && (
            <Button variant="ghost" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProjects}>
            Retry
          </Button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              stats={
                projectStats[project.id] || {
                  totalInvestors: 0,
                  totalRaised: 0,
                }
              }
              onEdit={() => {
                setCurrentProject(project);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setCurrentProject(project);
                setIsDeleteDialogOpen(true);
              }}
              onViewProject={onViewProject}
              onManageSubscription={onManageSubscription}
            />
          ))}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {searchQuery || statusFilter || typeFilter
                ? "No matching projects found"
                : "No projects yet"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery || statusFilter || typeFilter
                ? "Try adjusting your search or filters"
                : "Create your first project to start managing token issuances"}
            </p>
            {!(searchQuery || statusFilter || typeFilter) && (
              <Button
                onClick={() => {
                  setCurrentProject(null);
                  setIsAddDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Project Dialog */}
      <ProjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProject}
        isProcessing={isProcessing}
        title="Create New Project"
        description="Set up a new token issuance project"
      />

      {/* Edit Project Dialog */}
      {currentProject && (
        <ProjectDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditProject}
          isProcessing={isProcessing}
          title="Edit Project"
          description="Update project details"
          defaultValues={currentProject}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {currentProject && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteProject}
          isProcessing={isProcessing}
          itemName={currentProject.name}
          itemType="project"
        />
      )}
    </div>
  );
};

export default ProjectsList;
