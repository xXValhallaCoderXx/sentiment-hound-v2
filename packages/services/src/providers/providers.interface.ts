import { Provider } from "@repo/db";
export interface CreateProviderDto {
  name: string;
  type: string;
  endpoint: string;
}

export interface UpdateProviderDto {
  name?: string;
  type?: string;
  endpoint?: string;
}

export interface IProviderRepository {
  findAll(): Promise<Provider[]>;
  findById(id: string): Promise<Provider | null>;
  create(data: CreateProviderDto): Promise<Provider>;
  update(id: string, data: UpdateProviderDto): Promise<Provider>;
  delete(id: string): Promise<void>;
}

export interface IProviderService {
  createProvider(
    userId: string,
    name: string,
    type: string,
    credentials: any
  ): Promise<Provider>;
  getProvider(id: string): Promise<Provider>;
  getUserProviders(userId: string): Promise<Provider[]>;
  updateProvider(id: string, data: Partial<Provider>): Promise<Provider>;
  deleteProvider(id: string): Promise<void>;
}
