import { PostgrestError } from '@supabase/supabase-js';

/**
 * Safely handle Supabase responses with proper typing
 */
export function handleSupabaseResponse<T>(
  data: T[] | null, 
  error: PostgrestError | null,
  mapper: (item: any) => any
): { items: any[], error: Error | null } {
  if (error) {
    console.error("Supabase error:", error);
    return { items: [], error: new Error(error.message) };
  }
  
  try {
    const mappedItems = data ? data.map(mapper) : [];
    return { items: mappedItems, error: null };
  } catch (e) {
    console.error("Error mapping data:", e);
    return { items: [], error: e as Error };
  }
}

/**
 * Safely handle a single Supabase response with proper typing
 */
export function handleSupabaseSingleResponse<T>(
  data: T | null,
  error: PostgrestError | null,
  mapper: (item: any) => any
): { item: any | null, error: Error | null } {
  if (error) {
    console.error("Supabase error:", error);
    return { item: null, error: new Error(error.message) };
  }
  
  if (!data) {
    return { item: null, error: null };
  }
  
  try {
    const mappedItem = mapper(data);
    return { item: mappedItem, error: null };
  } catch (e) {
    console.error("Error mapping data:", e);
    return { item: null, error: e as Error };
  }
} 