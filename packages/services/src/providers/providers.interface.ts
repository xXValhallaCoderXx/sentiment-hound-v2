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
