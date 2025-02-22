import { IIntegration, IIntegrationRepository } from "./integrations.interface";
import {
  IntegrationError,
  IntegrationNotFoundError,
  IntegrationValidationError,
  IntegrationAuthenticationError,
} from "./integrations.errors";

export class CoreIntegrationService {
  constructor(private repository: IIntegrationRepository) {}

  async getIntegration(id: number): Promise<IIntegration> {
    const integration = await this.repository.findById(id);
    if (!integration) {
      throw new IntegrationNotFoundError(id);
    }
    return integration;
  }

  async getAllIntegrations(): Promise<IIntegration[]> {
    const integration = await this.repository.findAll();
    if (!integration) {
      throw new IntegrationNotFoundError("No integrations found");
    }
    return integration;
  }

  async getUserIntegrations(userId: string): Promise<IIntegration[]> {
    if (!userId) {
      throw new IntegrationValidationError("User ID is required");
    }
    return this.repository.findByUserId(userId);
  }

  async createIntegration(
    userId: string,
    accountId: string,
    providerId: number,
    accessToken: string,
    refreshToken: string
  ): Promise<IIntegration> {
    // Validation
    if (!userId || !accountId || !providerId) {
      throw new IntegrationValidationError("Missing required fields");
    }

    if (!accessToken) {
      throw new IntegrationAuthenticationError("Access token is required");
    }

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    try {
      return await this.repository.create({
        userId,
        accountId,
        providerId,
        accessToken,
        refreshToken,
        refreshTokenExpiresAt,
      });
    } catch (error) {
      throw new IntegrationError(
        "Failed to create integration",
        "INTEGRATION_CREATE_ERROR"
      );
    }
  }
}
