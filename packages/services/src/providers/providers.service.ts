import { Provider } from "@repo/db";
import { CreateProviderDto, UpdateProviderDto } from "./providers.interface";
import { ProviderRepository } from "./providers.repository";

export class CoreProviderService {
  constructor(private repository: ProviderRepository) {}

  async getAllProviders(): Promise<Provider[]> {
    return await this.repository.findAll();
  }

  async getProvider(id: string): Promise<Provider> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async getProviderByName(name: string): Promise<Provider> {
    const provider = await this.repository.findByName(name);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async createProvider(data: CreateProviderDto): Promise<Provider> {
    // Add validation if needed
    return await this.repository.create(data);
  }

  async updateProvider(id: string, data: UpdateProviderDto): Promise<Provider> {
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
