import {
  integrationsRepository,
  IntegrationsRepository,
} from "./integrations.repository";
import {
  ICreateIntegrationDTO,
  IUpdateCredentialsDTO,
} from "./intefrations.dto";

interface IGetUserIntegration {
  userId: string;
  name: string;
}
class IntegrationsService {
  private integrationsRepository: IntegrationsRepository;

  constructor(integrationsRepository: IntegrationsRepository) {
    this.integrationsRepository = integrationsRepository;
  }

  async getUserIntegrations(userId: string) {
    return this.integrationsRepository.getUserIntegrations(userId);
  }

  async getUserIntegration({ userId, name }: IGetUserIntegration) {
    return this.integrationsRepository.getUserIntegration(userId, name);
  }

  async deleteUserIntegration(userId: string, providerId: string) {
    return this.integrationsRepository.deleteUserIntegration(
      userId,
      providerId
    );
  }

  async createIntegration(data: ICreateIntegrationDTO) {
    return this.integrationsRepository.createIntegration(data);
  }

  async updateIntegrationAuthCredentials(data: IUpdateCredentialsDTO) {
    return this.integrationsRepository.updateIntegrationAuthCredentials(data);
  }
}

export const integrationsService = new IntegrationsService(
  integrationsRepository
);
