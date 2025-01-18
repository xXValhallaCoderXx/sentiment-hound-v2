export interface ICreateIntegrationDTO {
  providerId: number;
  remoteId: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: Date;
  userId: string;
}


export interface IUpdateCredentialsDTO {
  providerId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  userId: string;
}
  