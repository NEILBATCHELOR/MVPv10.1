import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    status: string;
    project_type: string;
    token_symbol?: string;
    target_raise?: number;
    authorized_shares?: number;
    share_price?: number;
    created_at?: string;
    updated_at?: string;
  };
  stats?: {
    totalInvestors: number;
    totalRaised: number;
  };
  onEdit: () => void;
  onDelete: () => void;
  onViewProject: (projectId: string) => void;
  onManageSubscription: (projectId: string) => void;
}

const ProjectCard = ({
  project,
  stats = { totalInvestors: 0, totalRaised: 0 },
  onEdit,
  onDelete,
  onViewProject,
  onManageSubscription,
}: ProjectCardProps) => {
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Add defensive checks to prevent accessing properties of undefined
  if (!project) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Project data unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to display project information</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl truncate" title={project?.name || ""}>
            {project?.name || "Unnamed Project"}
          </CardTitle>
          {getStatusBadge(project?.status || "draft")}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {project?.project_type || "unknown"}{" "}
          {project?.token_symbol ? `• ${project.token_symbol}` : ""}
        </p>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="text-sm line-clamp-2 h-10 mb-4">
          {project?.description || "No description provided"}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{stats?.totalInvestors || 0} Investors</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${(stats?.totalRaised || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Created: {formatDate(project?.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Updated: {formatDate(project?.updated_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onManageSubscription(project.id)}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            <span>Subscriptions</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onViewProject(project.id)}
          >
            <span>Cap Table</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
