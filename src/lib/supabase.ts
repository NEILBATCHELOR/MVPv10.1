import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Log environment variables availability (without exposing values)
console.log("Supabase configuration:", {
  urlAvailable: !!supabaseUrl,
  anonKeyAvailable: !!supabaseAnonKey,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      "x-client-info": "chain-capital-app",
    },
  },
});

// Enhanced debug function to check connection
export const checkSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase.from("projects").select("count");
    if (error) {
      console.error("Supabase connection error:", error);
      return { success: false, error };
    }
    console.log("Supabase connection successful:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Supabase connection exception:", err);
    return { success: false, error: err };
  }
};

// Enhanced debug function to log queries with detailed information
export const debugQuery = async (
  tableName: string,
  projectId?: string | null,
  options?: { detailed?: boolean },
) => {
  try {
    console.log(`Querying ${tableName} with projectId: ${projectId || "none"}`);
    let query = supabase.from(tableName as any).select("*");

    // Only add project_id filter if projectId is provided AND we're not querying certain tables
    // that might not have project_id column
    if (
      projectId &&
      projectId !== "${projectId}" && // Skip if projectId contains template literal
      tableName !== "investors" &&
      tableName !== "cap_table_investors" &&
      tableName !== "users" &&
      tableName !== "compliance_checks" &&
      tableName !== "token_allocations"
    ) {
      query = query.eq("project_id", projectId);
    }

    const startTime = performance.now();
    const { data, error } = await query;
    const endTime = performance.now();
    const queryTime = endTime - startTime;

    if (error) {
      console.error(`Error querying ${tableName}:`, error);

      // If the error is about a missing column, try to determine which columns exist
      if (error.code === "42703") {
        console.log(
          `Column error in ${tableName}, attempting to get table structure...`,
        );
        try {
          // Just get one row to see the structure
          const { data: sampleData } = await supabase
            .from(tableName as any)
            .select()
            .limit(1);
          if (sampleData && sampleData.length > 0) {
            console.log(
              `Available columns in ${tableName}:`,
              Object.keys(sampleData[0]),
            );

            // If we're looking for project_id but it doesn't exist, check for alternative columns
            if (error.message && error.message.includes("project_id")) {
              const columns = Object.keys(sampleData[0]);
              const possibleProjectIdColumns = columns.filter(
                (col) =>
                  col.includes("project") ||
                  col.includes("project_id") ||
                  col === "pid",
              );

              if (possibleProjectIdColumns.length > 0) {
                console.log(
                  `Possible alternative project ID columns: ${possibleProjectIdColumns.join(", ")}`,
                );
              }
            }
          }
        } catch (structErr) {
          console.error(
            `Failed to get table structure for ${tableName}:`,
            structErr,
          );
        }
      }

      return { success: false, error, queryTime };
    }

    console.log(
      `Found ${data?.length || 0} records in ${tableName} (${queryTime.toFixed(2)}ms)`,
    );

    if (options?.detailed && data && data.length > 0) {
      console.log(`Sample data from ${tableName}:`, data[0]);
    }

    return { success: true, data, count: data?.length || 0, queryTime };
  } catch (err) {
    console.error(`Exception querying ${tableName}:`, err);
    return { success: false, error: err };
  }
};

// === Mocked Auth Logic ===
export async function getUserRoles() {
  return [{ role: "admin" }]; // Mock: always admin
}

export async function logAction() {
  // Mock: no-op
  return;
}

// === Active Storage Logic ===
export async function uploadDocument(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, file);
  if (error) throw error;
  return data;
}

export async function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeDocument(filePath: string) {
  const { error } = await supabase.storage.from("documents").remove([filePath]);
  if (error) throw error;
  return true;
}
