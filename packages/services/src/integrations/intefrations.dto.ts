export interface ICreateIntegrationDTO {
  providerId: number;
  remoteId: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: Date;
  userId: string;
}
