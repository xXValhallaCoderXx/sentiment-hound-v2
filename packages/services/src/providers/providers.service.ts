import { Provider, Prisma } from "@repo/db";
import { CreateProviderDto, UpdateProviderDto } from "./providers.interface";
import { ProviderRepository } from "./providers.repository";

export class CoreProviderService {
  private providerCache = new Map<string, Provider>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(private repository: ProviderRepository) {}

  async getAllProviders(): Promise<Provider[]> {
    return await this.repository.findAll();
  }

  async getProvider(id: string): Promise<Provider> {
    console.log("GET PROVIDER: ", id);
    const provider = await this.repository.findUnique({ id: parseInt(id) });
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async getProviderByName(name: string): Promise<Provider> {
    if (!name) {
      throw new Error("Provider name is required");
    }

    const normalizedName = name.toLowerCase().trim();
    const cacheKey = `name:${normalizedName}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`Provider cache hit for: ${name}`);
      return cached;
    }

    console.log(`Provider cache miss for: ${name}, querying database`);

    try {
      // Case-insensitive lookup using findFirst with insensitive mode
      const provider = await this.repository.findFirst({
        name: {
          equals: name,
          mode: "insensitive",
        },
      });

      if (!provider) {
        throw new Error(
          `Provider '${name}' not found. Available providers may include: YouTube, Reddit`,
        );
      }

      // Cache the result
      this.setCache(cacheKey, provider);

      console.log(`Found provider: ${provider.name} (ID: ${provider.id})`);
      return provider;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw error; // Re-throw our custom error
      }

      console.error(`Database error looking up provider '${name}':`, error);
      throw new Error(
        `Failed to lookup provider '${name}': ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private getFromCache(key: string): Provider | null {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      // Cache expired
      this.providerCache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }

    return this.providerCache.get(key) || null;
  }

  private setCache(key: string, provider: Provider): void {
    this.providerCache.set(key, provider);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  clearCache(): void {
    this.providerCache.clear();
    this.cacheExpiry.clear();
  }

  async createProvider(data: Prisma.ProviderCreateInput): Promise<Provider> {
    // Add validation if needed
    const provider = await this.repository.create({ data });

    // Cache the new provider
    const cacheKey = `name:${provider.name.toLowerCase().trim()}`;
    this.setCache(cacheKey, provider);

    return provider;
  }

  async updateProvider(id: string, data: UpdateProviderDto): Promise<Provider> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }

    const updatedProvider = await this.repository.update(parseInt(id), data);

    // Clear cache for this provider since it was updated
    const cacheKey = `name:${provider.name.toLowerCase().trim()}`;
    this.providerCache.delete(cacheKey);
    this.cacheExpiry.delete(cacheKey);

    return updatedProvider;
  }

  async deleteProvider(id: string): Promise<void> {
    const provider = await this.repository.findById(id);
    if (!provider) {
      throw new Error(`Provider with ID ${id} not found`);
    }

    // Clear cache for this provider
    const cacheKey = `name:${provider.name.toLowerCase().trim()}`;
    this.providerCache.delete(cacheKey);
    this.cacheExpiry.delete(cacheKey);

    await this.repository.delete(parseInt(id));
  }
}
