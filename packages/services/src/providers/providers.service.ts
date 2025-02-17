import {
  IProvider,
  IProviderRepository,
  CreateProviderDto,
  UpdateProviderDto,
} from "./providers.interface";

export class CoreProviderService {
  constructor(private repository: IProviderRepository) {}

  async getAllProviders(): Promise<IProvider[]> {
    return await this.repository.findAll();
  }

  async getProvider(id: string): Promise<IProvider> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async createProvider(data: CreateProviderDto): Promise<IProvider> {
    // Add validation if needed
    return await this.repository.create(data);
  }

  async updateProvider(
    id: string,
    data: UpdateProviderDto
  ): Promise<IProvider> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return await this.repository.update(id, data);
  }

  async deleteProvider(id: string): Promise<void> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    await this.repository.delete(id);
  }
}
