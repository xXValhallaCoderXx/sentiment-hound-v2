import {
  ProvidersRepository,
  providersRepository,
} from "./providers.repository";
class ProviderService {
  private providersRepository: ProvidersRepository;

  constructor(providersRepository: ProvidersRepository) {
    this.providersRepository = providersRepository;
  }

  async getProviders() {
    return await this.providersRepository.getProviders();
  }

  async getProviderById(id: string) {
    return await this.providersRepository.getProviderById(id);
  }

  async getProviderByName(name: string) {
    return await this.providersRepository.getProviderByName(name);
  }
}

export const providersService = new ProviderService(providersRepository);
