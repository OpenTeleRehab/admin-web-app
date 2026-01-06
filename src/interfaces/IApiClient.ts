export interface IApiClientRequest {
  name: string;
  allow_ips: string;
}

export interface IApiClientResource {
  id: number;
  name: string;
  allow_ips: string[] | null;
  api_key: string;
  active: boolean;
}

export interface IApiclientResponse {
  api_key: string;
  secret_key: string;
}
