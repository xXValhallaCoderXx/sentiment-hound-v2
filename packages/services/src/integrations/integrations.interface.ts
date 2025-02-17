export interface IIntegration {
  id: number;
  accountId: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  userId: string;
  providerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIntegrationRepository {
  create(integration: Partial<IIntegration>): Promise<IIntegration>;
  findById(id: number): Promise<IIntegration | null>;
  findByUserId(userId: string): Promise<IIntegration[]>;
  update(id: number, data: Partial<IIntegration>): Promise<IIntegration>;
  delete(id: number): Promise<void>;
}

export interface IIntegrationService {
  createIntegration(
    userId: string,
    accountId: string,
    providerId: number,
    accessToken: string,
    refreshToken: string
  ): Promise<IIntegration>;
  getIntegration(id: number): Promise<IIntegration>;
  getUserIntegrations(userId: string): Promise<IIntegration[]>;
  updateIntegration(
    id: number,
    data: Partial<IIntegration>
  ): Promise<IIntegration>;
  deleteIntegration(id: number): Promise<void>;
}
