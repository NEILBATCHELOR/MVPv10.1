import { supabase } from "../supabase";

// Types
export interface OnfidoApplicant {
  first_name: string;
  last_name: string;
  email: string;
  dob?: string;
  country?: string;
}

export interface OnfidoCompany {
  name: string;
  registration_number: string;
  country: string;
}

export interface OnfidoCheck {
  applicant_id: string;
  check_type: string;
  documents?: string[];
}

export type VerificationType = "individual" | "business";

export interface VerificationRequest {
  investorId: string;
  type: VerificationType;
  applicantData: OnfidoApplicant;
  companyData?: OnfidoCompany;
}

// Create an Onfido applicant
export const createApplicant = async (
  applicantData: OnfidoApplicant,
  investorId: string,
): Promise<{ applicantId: string }> => {
  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/onfido-create-applicant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          firstName: applicantData.first_name,
          lastName: applicantData.last_name,
          email: applicantData.email,
          dateOfBirth: applicantData.dob,
          country: applicantData.country || "US",
          investorId,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create applicant");
    }

    const data = await response.json();
    return { applicantId: data.applicantId };
  } catch (error) {
    console.error("Error creating Onfido applicant:", error);
    throw error;
  }
};

// Create an Onfido check
export const createCheck = async (
  checkData: OnfidoCheck,
  investorId: string,
): Promise<{ checkId: string }> => {
  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/onfido-create-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          applicantId: checkData.applicant_id,
          checkType: checkData.check_type,
          investorId,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create check");
    }

    const data = await response.json();
    return { checkId: data.checkId };
  } catch (error) {
    console.error("Error creating Onfido check:", error);
    throw error;
  }
};

// Get the status of an Onfido check
export const getCheckStatus = async (
  checkId: string,
): Promise<{ status: string; result?: string }> => {
  try {
    // In a real implementation, you would call the Onfido API
    // For this demo, we'll simulate a check status
    return {
      status: "complete",
      result: Math.random() > 0.2 ? "clear" : "consider",
    };
  } catch (error) {
    console.error("Error getting Onfido check status:", error);
    throw error;
  }
};

// Generate an SDK token for the Onfido SDK
export const generateSdkToken = async (
  applicantId: string,
): Promise<{ success: boolean; token?: string; error?: string }> => {
  try {
    // In a real implementation, you would call your edge function
    // For this demo, we'll simulate a token
    return {
      success: true,
      token: `token-${Math.random().toString(36).substring(2, 15)}`,
    };
  } catch (error: any) {
    console.error("Error generating Onfido SDK token:", error);
    return { success: false, error: error.message };
  }
};

// Start verification process
export const startVerification = async (
  request: VerificationRequest,
): Promise<{
  success: boolean;
  applicantId?: string;
  checkId?: string;
  error?: string;
}> => {
  try {
    // Create applicant
    const { applicantId } = await createApplicant(
      request.applicantData,
      request.investorId,
    );

    // Create check
    const { checkId } = await createCheck(
      {
        applicant_id: applicantId,
        check_type: request.type === "individual" ? "standard" : "enhanced",
      },
      request.investorId,
    );

    return {
      success: true,
      applicantId,
      checkId,
    };
  } catch (error: any) {
    console.error("Error starting verification:", error);
    return { success: false, error: error.message };
  }
};

// Update investor verification status
export const updateInvestorVerificationStatus = async (
  investorId: string,
  status: string,
  checkId?: string | null,
  applicantId?: string | null,
  details?: string,
): Promise<boolean> => {
  try {
    // In a real implementation, you would update the investor record in your database
    console.log(
      `Updating investor ${investorId} verification status to ${status}`,
    );
    console.log(`Check ID: ${checkId}, Applicant ID: ${applicantId}`);
    console.log(`Details: ${details}`);

    // Simulate successful update
    return true;
  } catch (error) {
    console.error("Error updating investor verification status:", error);
    return false;
  }
};
