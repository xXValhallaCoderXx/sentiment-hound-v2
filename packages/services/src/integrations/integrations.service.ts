import { Integration } from "@repo/db";
import { IntegrationRepository } from "./integrations.repository";
import {
  IntegrationError,
  IntegrationNotFoundError,
  IntegrationValidationError,
  IntegrationAuthenticationError,
} from "./integrations.errors";

interface ICreateIntegration {
  userId: string;
  accountId: string;
  providerId: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}
export class CoreIntegrationService {
  constructor(
    private repository: IntegrationRepository,
    private planService?: any, // We'll inject this later to avoid circular dependency
  ) {}

  setPlanService(planService: any) {
    this.planService = planService;
  }

  async getIntegration(id: number): Promise<Integration> {
    console.log("Getting integration with ID:", id);
    const integration = await this.repository.findById(id);
    if (!integration) {
      throw new IntegrationNotFoundError(id);
    }
    return integration;
  }

  getIntegrationUserIntegrationByProviderId(
    providerId: number,
    userId: string,
  ): Promise<Integration | null> {
    return this.repository.findByProviderIdAndUserId(providerId, userId);
  }

  async getAllIntegrations(): Promise<Integration[]> {
    const integration = await this.repository.findAll();
    if (!integration) {
      throw new IntegrationNotFoundError("No integrations found");
    }
    return integration;
  }

  async getUserIntegrations(userId: string): Promise<Integration[]> {
    if (!userId) {
      throw new IntegrationValidationError("User ID is required");
    }
    return this.repository.findByUserId(userId);
  }

  async getUserIntegrationByName(
    userId: string,
    providerName: string,
  ): Promise<Integration | null> {
    if (!userId || !providerName) {
      throw new IntegrationValidationError(
        "User ID and provider name are required",
      );
    }
    return this.repository.findByUserIdAndProviderName(userId, providerName);
  }

  async createIntegration({
    userId,
    accessToken,
    accountId,
    providerId,
    refreshToken,
    refreshTokenExpiresAt,
  }: ICreateIntegration): Promise<Integration> {
    // Validation
    if (!userId || !accountId || !providerId) {
      throw new IntegrationValidationError("Missing required fields");
    }

    if (!accessToken) {
      throw new IntegrationAuthenticationError("Access token is required");
    }

    // Check plan limits if plan service is available
    if (this.planService) {
      const planCheck = await this.planService.canUserCreateIntegration(userId);
      if (!planCheck.canCreate) {
        throw new IntegrationValidationError(
          planCheck.reason || "Plan limit exceeded",
        );
      }
    }

    try {
      return await this.repository.create({
        data: {
          userId,
          accountId,
          providerId,
          accessToken,
          refreshToken,
          refreshTokenExpiresAt,
        },
      });
    } catch (error) {
      throw new IntegrationError(
        "Failed to create integration",
        "INTEGRATION_CREATE_ERROR",
      );
    }
  }

  async updateIntegrationAuthCredentials({
    providerId,
    userId,
    accessToken,
    refreshToken,
    accessTokenExpiry,
  }: {
    providerId: number;
    userId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: Date;
  }): Promise<Integration> {
    // Verify the integration exists before attempting to update
    const integration = await this.repository.findByProviderIdAndUserId(
      providerId,
      userId,
    );
    if (!integration) {
      throw new IntegrationNotFoundError(providerId);
    }

    try {
      return await this.repository.update(integration?.id, {
        accessToken,
        refreshToken,
        refreshTokenExpiresAt: accessTokenExpiry,
      });
    } catch (error) {
      console.log("Error updating integration:", error);
      throw new IntegrationError(
        "Failed to update integration",
        "INTEGRATION_UPDATE_ERROR",
      );
    }
  }

  async deleteIntegration(id: number): Promise<void> {
    // Verify the integration exists before attempting to delete
    const integration = await this.repository.findById(id);
    if (!integration) {
      throw new IntegrationNotFoundError(id);
    }

    // Delete related records first (this needs to be implemented in your repository)
    await this.repository.deleteRelatedRecords(id);

    // Then delete the integration
    await this.repository.delete(id);
  }
}
