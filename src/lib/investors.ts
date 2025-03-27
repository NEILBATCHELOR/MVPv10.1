import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";
import { Investor } from "@/types/models";
import { mapDbInvestorToInvestor } from "@/utils/typeMappers";

// Types
export interface InvestorSubscription {
  id: string;
  investor_id: string;
  project_id: string;
  subscription_id: string;
  currency: string;
  fiat_amount: number;
  subscription_date: string;
  confirmed: boolean;
  allocated: boolean;
  distributed: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TokenAllocation {
  id: string;
  subscription_id: string;
  token_amount: number;
  token_type: string;
  distributed: boolean;
  distribution_date?: string | null;
  distribution_tx_hash?: string | null;
  created_at?: string;
}

// Fetch all investors
export async function getInvestors(): Promise<Investor[]> {
  const { data, error } = await supabase
    .from("investors")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching investors:", error);
    throw error;
  }

  return data ? data.map(mapDbInvestorToInvestor) : [];
}

// Fetch a specific investor
export async function getInvestor(
  investorId: string,
): Promise<Investor | null> {
  const { data, error } = await supabase
    .from("investors")
    .select("*")
    .eq("id", investorId)
    .single();

  if (error) {
    console.error(`Error fetching investor ${investorId}:`, error);
    return null;
  }

  return data ? mapDbInvestorToInvestor(data) : null;
}

// Create a new investor
export async function createInvestor(
  investorData: Omit<Investor, "id" | "createdAt" | "updatedAt">,
): Promise<Investor | null> {
  const now = new Date().toISOString();
  const newInvestor = {
    id: crypto.randomUUID(),
    name: investorData.name,
    email: investorData.email,
    type: investorData.type,
    company: investorData.company || null,
    kyc_status: investorData.kycStatus || "not_started",
    kyc_expiry_date: investorData.kycExpiryDate?.toISOString() || null,
    wallet_address: investorData.walletAddress || null,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("investors")
    .insert(newInvestor)
    .select()
    .single();

  if (error) {
    console.error("Error creating investor:", error);
    throw error;
  }

  return data ? mapDbInvestorToInvestor(data) : null;
}

// Update an existing investor
export async function updateInvestor(
  investorId: string,
  updates: Partial<Omit<Investor, "id" | "createdAt" | "updatedAt">>,
): Promise<Investor | null> {
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  // Convert from application model to database schema
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.company !== undefined) updateData.company = updates.company;
  if (updates.kycStatus !== undefined)
    updateData.kyc_status = updates.kycStatus;
  if (updates.kycExpiryDate !== undefined)
    updateData.kyc_expiry_date = updates.kycExpiryDate?.toISOString();
  if (updates.walletAddress !== undefined)
    updateData.wallet_address = updates.walletAddress;

  const { data, error } = await supabase
    .from("investors")
    .update(updateData)
    .eq("id", investorId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating investor ${investorId}:`, error);
    throw error;
  }

  return data ? mapDbInvestorToInvestor(data) : null;
}

// Delete an investor
export const deleteInvestor = async (investorId: string): Promise<void> => {
  try {
    // First check if there are any subscriptions for this investor
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("investor_id", investorId);

    if (subscriptionsError) {
      console.error(
        `Error checking subscriptions for investor ${investorId}:`,
        subscriptionsError,
      );
      throw subscriptionsError;
    }

    // If there are subscriptions, delete them first
    if (subscriptions && subscriptions.length > 0) {
      const subscriptionIds = subscriptions.map((s) => s.id);

      // Delete token allocations for these subscriptions
      const { error: allocationsError } = await supabase
        .from("token_allocations")
        .delete()
        .in("subscription_id", subscriptionIds);

      if (allocationsError) {
        console.error(
          `Error deleting token allocations for investor ${investorId}:`,
          allocationsError,
        );
        throw allocationsError;
      }

      // Delete subscriptions
      const { error: deleteSubscriptionsError } = await supabase
        .from("subscriptions")
        .delete()
        .eq("investor_id", investorId);

      if (deleteSubscriptionsError) {
        console.error(
          `Error deleting subscriptions for investor ${investorId}:`,
          deleteSubscriptionsError,
        );
        throw deleteSubscriptionsError;
      }
    }

    // Check for redemption requests
    const { data: redemptions, error: redemptionsError } = await supabase
      .from("redemption_requests")
      .select("id")
      .eq("investor_id", investorId);

    if (redemptionsError) {
      console.error(
        `Error checking redemptions for investor ${investorId}:`,
        redemptionsError,
      );
      // Continue even if check fails
    } else if (redemptions && redemptions.length > 0) {
      // Delete redemption approvers first
      const redemptionIds = redemptions.map((r) => r.id);

      const { error: approversError } = await supabase
        .from("redemption_approvers")
        .delete()
        .in("redemption_id", redemptionIds);

      if (approversError) {
        console.error(
          `Error deleting redemption approvers for investor ${investorId}:`,
          approversError,
        );
        // Continue even if deletion fails
      }

      // Delete redemption requests
      const { error: redemptionsDeleteError } = await supabase
        .from("redemption_requests")
        .delete()
        .eq("investor_id", investorId);

      if (redemptionsDeleteError) {
        console.error(
          `Error deleting redemptions for investor ${investorId}:`,
          redemptionsDeleteError,
        );
        // Continue even if deletion fails
      }
    }

    // Delete investor from cap table associations
    const { error: capTableError } = await supabase
      .from("cap_table_investors")
      .delete()
      .eq("investor_id", investorId);

    if (capTableError) {
      console.error(
        `Error deleting cap table associations for investor ${investorId}:`,
        capTableError,
      );
      throw capTableError;
    }

    // Delete investor from investor groups
    const { error: groupsError } = await supabase
      .from("investor_groups_investors")
      .delete()
      .eq("investor_id", investorId);

    if (groupsError) {
      console.error(
        `Error deleting investor group associations for investor ${investorId}:`,
        groupsError,
      );
      // Continue even if deletion fails
    }

    // Finally, delete the investor
    const { error } = await supabase
      .from("investors")
      .delete()
      .eq("id", investorId);

    if (error) {
      console.error(`Error deleting investor with ID ${investorId}:`, error);
      throw error;
    }

    console.log(`Successfully deleted investor with ID ${investorId}`);
  } catch (error) {
    console.error(`Error in deleteInvestor for ID ${investorId}:`, error);
    throw error;
  }
};

// Get subscriptions for a specific investor
export const getInvestorSubscriptions = async (
  investorId: string,
): Promise<any[]> => {
  try {
    // Get subscriptions for this investor
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select(
        `
        id,
        investor_id,
        project_id,
        subscription_id,
        currency,
        fiat_amount,
        subscription_date,
        confirmed,
        allocated,
        distributed,
        notes,
        projects(name)
      `,
      )
      .eq("investor_id", investorId);

    if (subscriptionsError) {
      console.error(
        `Error fetching subscriptions for investor ${investorId}:`,
        subscriptionsError,
      );
      throw subscriptionsError;
    }

    // Get token allocations for these subscriptions
    if (subscriptions && subscriptions.length > 0) {
      const subscriptionIds = subscriptions.map((s) => s.id);

      const { data: tokenAllocations, error: tokenError } = await supabase
        .from("token_allocations")
        .select("*")
        .in("subscription_id", subscriptionIds);

      if (tokenError) {
        console.error(
          `Error fetching token allocations for investor ${investorId}:`,
          tokenError,
        );
        throw tokenError;
      }

      // Combine the data
      const enrichedSubscriptions = subscriptions.map((subscription) => {
        const allocations =
          tokenAllocations?.filter(
            (ta) => ta.subscription_id === subscription.id,
          ) || [];
        return {
          ...subscription,
          project_name: subscription.projects?.name || "Unknown Project",
          token_type: allocations.length > 0 ? allocations[0].token_type : null,
          token_amount:
            allocations.length > 0 ? allocations[0].token_amount : 0,
          token_allocations: allocations,
        };
      });

      return enrichedSubscriptions;
    }

    return subscriptions || [];
  } catch (error) {
    console.error(
      `Error in getInvestorSubscriptions for investor ${investorId}:`,
      error,
    );
    throw error;
  }
};

// Fetch investors for a specific project
export const getInvestorsByProjectId = async (
  projectId: string,
): Promise<any[]> => {
  // First get the cap table for this project
  const { data: capTable, error: capTableError } = await supabase
    .from("cap_tables")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (capTableError && capTableError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(
      `Error fetching cap table for project ${projectId}:`,
      capTableError,
    );
    throw capTableError;
  }

  if (!capTable) {
    return [];
  }

  // Get investors from the cap table
  const { data: capTableInvestors, error: investorsError } = await supabase
    .from("cap_table_investors")
    .select(
      `
      investor_id,
      investors!inner(
        investor_id,
        name,
        email,
        type,
        kyc_status,
        kyc_expiry_date,
        wallet_address,
        verification_details
      ),
      subscriptions(
        id,
        subscription_id,
        currency,
        fiat_amount,
        subscription_date,
        confirmed,
        allocated,
        distributed,
        notes,
        token_allocations(
          id,
          token_amount,
          token_type,
          distributed,
          distribution_date,
          distribution_tx_hash
        )
      )
    `,
    )
    .eq("cap_table_id", capTable.id);

  if (investorsError) {
    console.error(
      `Error fetching investors for project ${projectId}:`,
      investorsError,
    );
    throw investorsError;
  }

  // Ensure all required fields are present in the returned data
  return capTableInvestors
    ? capTableInvestors.map((investor) => ({
        id: investor.investor_id,
        name: investor.investors?.name,
        email: investor.investors?.email,
        company: investor.investors?.company || undefined,
        type: investor.investors?.type,
        kycStatus: investor.investors?.kyc_status,
        kycExpiryDate: investor.investors?.kyc_expiry_date
          ? new Date(investor.investors.kyc_expiry_date)
          : null,
        walletAddress: investor.investors?.wallet_address || undefined,
        createdAt: investor.created_at
          ? new Date(investor.created_at)
          : new Date(),
        updatedAt: investor.updated_at
          ? new Date(investor.updated_at)
          : new Date(),
        subscriptions: investor.subscriptions || [],
      }))
    : [];
};

// Add an investor to a project's cap table
export const addInvestorToProject = async (
  projectId: string,
  investorId: string,
  subscriptionData: {
    subscription_id: string;
    currency: string;
    fiat_amount: number;
    subscription_date: string;
    confirmed?: boolean;
    allocated?: boolean;
    distributed?: boolean;
    notes?: string;
  },
): Promise<any> => {
  // First get the cap table for this project
  const { data: capTable, error: capTableError } = await supabase
    .from("cap_tables")
    .select("id")
    .eq("project_id", projectId)
    .single();

  if (capTableError) {
    console.error(
      `Error fetching cap table for project ${projectId}:`,
      capTableError,
    );
    throw capTableError;
  }

  // Create a subscription record
  const subscriptionId = uuidv4();
  const now = new Date().toISOString();

  const subscription = {
    id: subscriptionId,
    investor_id: investorId,
    project_id: projectId,
    subscription_id: subscriptionData.subscription_id,
    currency: subscriptionData.currency,
    fiat_amount: subscriptionData.fiat_amount,
    subscription_date: subscriptionData.subscription_date,
    confirmed: subscriptionData.confirmed || false,
    allocated: subscriptionData.allocated || false,
    distributed: subscriptionData.distributed || false,
    notes: subscriptionData.notes || null,
    created_at: now,
    updated_at: now,
  };

  const { data: subscriptionData_, error: subscriptionError } = await supabase
    .from("subscriptions")
    .insert(subscription)
    .select()
    .single();

  if (subscriptionError) {
    console.error(
      `Error creating subscription for investor ${investorId}:`,
      subscriptionError,
    );
    throw subscriptionError;
  }

  // Add investor to cap table
  const capTableInvestor = {
    cap_table_id: capTable.id,
    investor_id: investorId,
    created_at: now,
  };

  const { data: capTableInvestorData, error: capTableInvestorError } =
    await supabase
      .from("cap_table_investors")
      .insert(capTableInvestor)
      .select()
      .single();

  if (capTableInvestorError) {
    console.error(
      `Error adding investor ${investorId} to cap table:`,
      capTableInvestorError,
    );
    throw capTableInvestorError;
  }

  return {
    subscription: subscriptionData_,
    capTableInvestor: capTableInvestorData,
  };
};

// Add a token allocation to a subscription
export const addTokenAllocation = async (
  subscriptionId: string,
  allocationData: {
    token_amount: number;
    token_type: string;
    distributed?: boolean;
    distribution_date?: string | null;
    distribution_tx_hash?: string | null;
  },
): Promise<TokenAllocation> => {
  const allocationId = uuidv4();
  const now = new Date().toISOString();

  const allocation = {
    id: allocationId,
    subscription_id: subscriptionId,
    token_amount: allocationData.token_amount,
    token_type: allocationData.token_type,
    distributed: allocationData.distributed || false,
    distribution_date: allocationData.distribution_date || null,
    distribution_tx_hash: allocationData.distribution_tx_hash || null,
    created_at: now,
  };

  const { data, error } = await supabase
    .from("token_allocations")
    .insert(allocation)
    .select()
    .single();

  if (error) {
    console.error(
      `Error creating token allocation for subscription ${subscriptionId}:`,
      error,
    );
    throw error;
  }

  return data;
};

// Update a subscription
export const updateSubscription = async (
  subscriptionId: string,
  subscriptionData: {
    currency?: string;
    fiat_amount?: number;
    subscription_date?: string;
    confirmed?: boolean;
    allocated?: boolean;
    distributed?: boolean;
    notes?: string;
  },
): Promise<InvestorSubscription> => {
  const now = new Date().toISOString();

  const updates = {
    ...subscriptionData,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single();

  if (error) {
    console.error(
      `Error updating subscription with ID ${subscriptionId}:`,
      error,
    );
    throw error;
  }

  return data;
};

// Update a token allocation
export const updateTokenAllocation = async (
  allocationId: string,
  allocationData: {
    token_amount?: number;
    token_type?: string;
    distributed?: boolean;
    distribution_date?: string | null;
    distribution_tx_hash?: string | null;
  },
): Promise<TokenAllocation> => {
  const { data, error } = await supabase
    .from("token_allocations")
    .update(allocationData)
    .eq("id", allocationId)
    .select()
    .single();

  if (error) {
    console.error(
      `Error updating token allocation with ID ${allocationId}:`,
      error,
    );
    throw error;
  }

  return data;
};

// Delete a subscription
export const deleteSubscription = async (
  subscriptionId: string,
): Promise<void> => {
  // First delete any token allocations
  const { error: allocationsError } = await supabase
    .from("token_allocations")
    .delete()
    .eq("subscription_id", subscriptionId);

  if (allocationsError) {
    console.error(
      `Error deleting token allocations for subscription ${subscriptionId}:`,
      allocationsError,
    );
    throw allocationsError;
  }

  // Then delete the subscription
  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", subscriptionId);

  if (error) {
    console.error(
      `Error deleting subscription with ID ${subscriptionId}:`,
      error,
    );
    throw error;
  }
};

// Update investor KYC status
export const updateInvestorKYC = async (
  investorId: string,
  kycData: {
    kyc_status: string;
    kyc_expiry_date?: string | null;
    verification_details?: any;
  },
): Promise<Investor> => {
  const now = new Date().toISOString();

  const updates = {
    ...kycData,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("investors")
    .update(updates)
    .eq("id", investorId)
    .select()
    .single();

  if (error) {
    console.error(
      `Error updating KYC status for investor ${investorId}:`,
      error,
    );
    throw error;
  }

  return data;
};

// Get investors by KYC status
export const getInvestorsByKYCStatus = async (
  status: string,
): Promise<Investor[]> => {
  const { data, error } = await supabase
    .from("investors")
    .select("*")
    .eq("kyc_status", status)
    .order("name", { ascending: true });

  if (error) {
    console.error(`Error fetching investors with KYC status ${status}:`, error);
    throw error;
  }

  return data || [];
};

// Get investors with expiring KYC
export const getInvestorsWithExpiringKYC = async (
  daysThreshold: number = 30,
): Promise<Investor[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  const thresholdDateStr = thresholdDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("investors")
    .select("*")
    .eq("kyc_status", "approved")
    .lt("kyc_expiry_date", thresholdDateStr)
    .order("kyc_expiry_date", { ascending: true });

  if (error) {
    console.error(`Error fetching investors with expiring KYC:`, error);
    throw error;
  }

  return data || [];
};
