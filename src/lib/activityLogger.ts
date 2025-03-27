import { supabase } from "./supabase";
import { Tables } from "@/types/supabase";

export type ActivityLogEntry = Tables<"audit_logs">;

/**
 * Logs an activity to the audit_logs table
 * @param action The action being performed (e.g., "create_investor", "update_subscription")
 * @param details Additional details about the action
 * @param entityId Optional ID of the entity being acted upon
 * @param entityType Optional type of entity being acted upon (e.g., "investor", "subscription")
 * @param projectId Optional project ID related to the action
 * @param status Optional status of the action (e.g., "success", "failure")
 * @returns The created log entry or null if there was an error
 */
export const logActivity = async (params: {
  action: string;
  user_id?: string;
  user_email?: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  status?: string;
  project_id?: string;
  metadata?: any;
}): Promise<ActivityLogEntry | null> => {
  const {
    action,
    user_id,
    user_email,
    entity_type,
    entity_id,
    details,
    status = "success",
    project_id,
  } = params;
  try {
    // Get current user info - in a real app, this would come from your auth system
    // For now, we'll use a placeholder
    const userEmail = "admin@example.com";
    const userId = "current-user";

    // Convert details to string if it's an object
    const detailsStr =
      typeof details === "object" ? JSON.stringify(details) : details || "";

    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        action: action,
        details: detailsStr,
        entity_id: entity_id,
        entity_type: entity_type,
        project_id: project_id,
        user_email: user_email || userEmail,
        user_id: user_id || userId,
        status,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging activity:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception logging activity:", error);
    return null;
  }
};

/**
 * Get activity logs based on specified criteria
 * @param filter Object containing filter criteria
 * @returns Array of activity log entries
 */
export const getActivityLogs = async (filter: {
  action?: string;
  user_id?: string;
  entity_type?: string;
  entity_id?: string;
  start_date?: Date;
  end_date?: Date;
  limit?: number | string;
}): Promise<ActivityLogEntry[]> => {
  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (filter.action) {
    query = query.eq("action", filter.action);
  }
  if (filter.user_id) {
    query = query.eq("user_id", filter.user_id);
  }
  if (filter.entity_type) {
    query = query.eq("entity_type", filter.entity_type);
  }
  if (filter.entity_id) {
    query = query.eq("entity_id", filter.entity_id);
  }
  if (filter.start_date) {
    query = query.gte("created_at", filter.start_date.toISOString());
  }
  if (filter.end_date) {
    query = query.lte("created_at", filter.end_date.toISOString());
  }
  
  // Apply limit if provided
  if (filter.limit) {
    const numericLimit = typeof filter.limit === 'number' ? filter.limit : parseInt(String(filter.limit), 10);
    query = query.limit(numericLimit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return (data || []) as ActivityLogEntry[];
};

/**
 * Get activity logs for a specific entity
 * @param entityType The type of entity
 * @param entityId The ID of the entity
 * @param limit Optional limit for number of logs to return
 * @returns Array of activity log entries
 */
export const getEntityActivityLogs = async (
  entityType: string,
  entityId: string,
  limit?: number | string,
): Promise<ActivityLogEntry[]> => {
  return getActivityLogs({
    entity_type: entityType,
    entity_id: entityId,
    limit,
  });
};

/**
 * Get recent activity logs for the current user
 * @param userId The ID of the user (optional, defaults to current user)
 * @param limit The maximum number of logs to return (optional, defaults to 10)
 * @returns Array of activity log entries
 */
export const getUserRecentActivity = async (
  userId?: string,
  limit: number | string = 10,
): Promise<ActivityLogEntry[]> => {
  // In a real app, you would get the current user ID from your auth system
  const currentUserId = userId || "current-user";

  return getActivityLogs({
    user_id: currentUserId,
    limit: typeof limit === 'number' ? limit : parseInt(limit, 10),
  });
};

/**
 * Exports activity logs to CSV format
 * @param logs The logs to export
 * @returns CSV string
 */
export const exportLogsToCSV = (logs: ActivityLogEntry[]): string => {
  if (logs.length === 0) return "";

  // Define CSV headers
  const headers = [
    "Timestamp",
    "User",
    "Action",
    "Entity Type",
    "Entity ID",
    "Status",
    "Details",
  ];

  // Format the data for each log
  const rows = logs.map((log) => {
    // Format timestamp
    const timestamp = log.timestamp
      ? new Date(log.timestamp).toISOString()
      : "";

    // Escape fields that might contain commas or quotes
    const escapeCsvField = (field: string | null | undefined): string => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`; // Escape quotes by doubling them
      }
      return str;
    };

    return [
      timestamp,
      escapeCsvField(log.user_email),
      escapeCsvField(log.action),
      escapeCsvField(log.entity_type),
      escapeCsvField(log.entity_id),
      escapeCsvField(log.status),
      escapeCsvField(log.details),
    ].join(",");
  });

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
};
