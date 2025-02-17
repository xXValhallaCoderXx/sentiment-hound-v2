export interface IProvider {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  findAll(): Promise<IProvider[]>;
  findById(id: string): Promise<IProvider | null>;
  create(data: CreateProviderDto): Promise<IProvider>;
  update(id: string, data: UpdateProviderDto): Promise<IProvider>;
  delete(id: string): Promise<void>;
}

export interface IProviderService {
  createProvider(
    userId: string,
    name: string,
    type: string,
    credentials: any
  ): Promise<IProvider>;
  getProvider(id: string): Promise<IProvider>;
  getUserProviders(userId: string): Promise<IProvider[]>;
  updateProvider(id: string, data: Partial<IProvider>): Promise<IProvider>;
  deleteProvider(id: string): Promise<void>;
}
