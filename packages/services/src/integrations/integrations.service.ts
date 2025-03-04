import { IIntegration, IIntegrationRepository } from "./integrations.interface";
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
}
export class CoreIntegrationService {
  constructor(private repository: IIntegrationRepository) {}

  async getIntegration(id: number): Promise<IIntegration> {
    console.log("GET INTEGRATION: ", id);
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

  async createIntegration({
    userId,
    accessToken,
    accountId,
    providerId,
    refreshToken,
  }: ICreateIntegration): Promise<IIntegration> {
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

  async deleteIntegration(id: number): Promise<void> {
    // Verify the integration exists before attempting to delete
    const integration = await this.repository.findById(id);
    if (!integration) {
      throw new IntegrationNotFoundError(id);
    }

    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new IntegrationError(
        "Failed to delete integration",
        "INTEGRATION_DELETE_ERROR"
      );
    }
  }
}
