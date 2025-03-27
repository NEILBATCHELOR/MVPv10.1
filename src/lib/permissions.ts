import { supabase } from "./supabase";
import { Permission, PermissionUpdate } from "@/types/permissions";

export async function savePermissions(
  permissions: Permission[],
  userId: string,
): Promise<void> {
  const update: PermissionUpdate = {
    permissions,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  };

  // Convert the update object to a JSON string and store it in the metadata field
  const { error } = await supabase.from("system_settings").upsert({
    key: "permissions",
    value: JSON.stringify(update),
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function loadPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("key", "permissions")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error loading permissions:", error);
    return [];
  }

  try {
    const parsedData = JSON.parse(data?.value || "{}");
    return parsedData?.permissions || [];
  } catch (e) {
    console.error("Error parsing permissions data:", e);
    return [];
  }
}
