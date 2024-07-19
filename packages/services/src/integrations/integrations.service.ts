import {
  integrationsRepository,
  IntegrationsRepository,
} from "./integrations.repository";
class IntegrationsService {
  private integrationsRepository: IntegrationsRepository;

  constructor(integrationsRepository: IntegrationsRepository) {
    this.integrationsRepository = integrationsRepository;
  }

  async getUserIntegrations(userId: string) {
    return this.integrationsRepository.getUserIntegrations(userId);
  }

  async getUserIntegration(userId: string, name: string) {
    return this.integrationsRepository.getUserIntegration(userId, name);
  }

  async deleteUserIntegration(userId: string, providerId: string) {
    return this.integrationsRepository.deleteUserIntegration(
      userId,
      providerId
    );
  }
}

export const integrationsService = new IntegrationsService(
  integrationsRepository
);
