import type { Database } from "@/types/supabase";
import {
  Project,
  Investor,
  Subscription,
  RedemptionRequest,
  User,
  ActivityLog,
} from "@/types/models";
import { toDate } from "./dateHelpers";

/**
 * Maps database project record to application Project model
 */
export function mapDbProjectToProject(
  dbProject: Database["public"]["Tables"]["projects"]["Row"],
): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description || "",
    status: dbProject.status,
    projectType: dbProject.project_type,
    tokenSymbol: dbProject.token_symbol,
    targetRaise: dbProject.target_raise,
    authorizedShares: dbProject.authorized_shares,
    sharePrice: dbProject.share_price,
    companyValuation: dbProject.company_valuation,
    fundingRound: dbProject.funding_round,
    legalEntity: dbProject.legal_entity,
    jurisdiction: dbProject.jurisdiction,
    taxId: dbProject.tax_id,
    createdAt: toDate(dbProject.created_at) || new Date(),
    updatedAt: toDate(dbProject.updated_at) || new Date(),
    // Add any missing fields with default values
    organizationId: dbProject.organization_id || "",
    ownerId: dbProject.owner_id || "",
    // Additional properties that might be required by the Project type
    website: dbProject.website || "",
    logo: dbProject.logo || "",
    documents: dbProject.documents || [],
    tags: dbProject.tags || [],
    category: dbProject.category || "",
    investorCount: dbProject.investor_count || 0,
    totalInvestment: dbProject.total_investment || 0,
  };
}

/**
 * Maps database investor record to application Investor model
 */
export function mapDbInvestorToInvestor(
  dbInvestor: Database["public"]["Tables"]["investors"]["Row"],
): Investor {
  return {
    id: dbInvestor.id,
    name: dbInvestor.name,
    email: dbInvestor.email,
    company: dbInvestor.company || undefined,
    type: dbInvestor.type,
    kycStatus: dbInvestor.kyc_status,
    kycExpiryDate: toDate(dbInvestor.kyc_expiry_date),
    walletAddress: dbInvestor.wallet_address || undefined,
    createdAt: toDate(dbInvestor.created_at) || new Date(),
    updatedAt: toDate(dbInvestor.updated_at) || new Date(),
  };
}

/**
 * Maps database subscription record to application Subscription model
 */
export function mapDbSubscriptionToSubscription(
  dbSubscription: Database["public"]["Tables"]["subscriptions"]["Row"],
): Subscription {
  return {
    id: dbSubscription.id,
    investorId: dbSubscription.investor_id,
    investorName: dbSubscription.investor_name || "",
    projectId: dbSubscription.project_id,
    currency: dbSubscription.currency,
    fiatAmount: dbSubscription.fiat_amount,
    tokenAmount: dbSubscription.token_amount || 0,
    confirmed: dbSubscription.confirmed || false,
    allocated: dbSubscription.allocated || false,
    distributed: dbSubscription.distributed || false,
    status: dbSubscription.status || "pending",
    createdAt: toDate(dbSubscription.created_at) || new Date(),
    updatedAt: toDate(dbSubscription.updated_at) || new Date(),
  };
}

/**
 * Maps database redemption request to application RedemptionRequest model
 */
export function mapDbRedemptionToRedemptionRequest(
  dbRedemption: Database["public"]["Tables"]["redemption_requests"]["Row"],
): RedemptionRequest {
  return {
    id: dbRedemption.id,
    requestDate: toDate(dbRedemption.request_date) || new Date(),
    tokenAmount:
      typeof dbRedemption.token_amount === "string"
        ? parseFloat(dbRedemption.token_amount)
        : Number(dbRedemption.token_amount),
    tokenType: dbRedemption.token_type,
    redemptionType: dbRedemption.redemption_type,
    status: dbRedemption.status,
    sourceWalletAddress: dbRedemption.source_wallet_address,
    destinationWalletAddress: dbRedemption.destination_wallet_address,
    conversionRate: dbRedemption.conversion_rate
      ? typeof dbRedemption.conversion_rate === "string"
        ? parseFloat(dbRedemption.conversion_rate)
        : Number(dbRedemption.conversion_rate)
      : undefined,
    investorName: dbRedemption.investor_name || "",
    investorId: dbRedemption.investor_id,
    isBulkRedemption: !!dbRedemption.is_bulk_redemption,
    investorCount: dbRedemption.investor_count || 1,
    approvers: dbRedemption.approvers || [],
    requiredApprovals: dbRedemption.required_approvals || 0,
  };
}

/**
 * Maps database activity log to application ActivityLog model
 */
export function mapDbActivityToActivityLog(
  dbActivity: Database["public"]["Tables"]["audit_logs"]["Row"],
): ActivityLog {
  return {
    id: dbActivity.id,
    timestamp: toDate(dbActivity.timestamp) || new Date(),
    action: dbActivity.action,
    userId: dbActivity.user_id,
    userEmail: dbActivity.user_email,
    entityType: dbActivity.entity_type,
    entityId: dbActivity.entity_id,
    details:
      typeof dbActivity.details === "string"
        ? dbActivity.details
        : JSON.stringify(dbActivity.details),
    status: dbActivity.status,
    projectId: dbActivity.project_id,
  };
}
