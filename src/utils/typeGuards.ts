import { 
  Project, Investor, Subscription, RedemptionRequest, 
  User, ActivityLog 
} from "@/types/models";

/**
 * Type guard for Project
 */
export function isProject(data: unknown): data is Project {
  return data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'status' in data;
}

/**
 * Type guard for Investor
 */
export function isInvestor(data: unknown): data is Investor {
  return data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'email' in data &&
    'type' in data;
}

/**
 * Type guard for Subscription
 */
export function isSubscription(data: unknown): data is Subscription {
  return data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'investorId' in data &&
    'projectId' in data &&
    'fiatAmount' in data;
}

/**
 * Type guard for RedemptionRequest
 */
export function isRedemptionRequest(data: unknown): data is RedemptionRequest {
  return data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'requestDate' in data &&
    'tokenAmount' in data &&
    'status' in data;
}

/**
 * Type guard for User
 */
export function isUser(data: unknown): data is User {
  return data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'email' in data &&
    'role' in data;
} 