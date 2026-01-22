export interface IPhcWorker {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dial_code?: string;
  enabled: number;
  identity: string;
  country_id: number;
  region_id: number;
  province_id: number;
  phc_service_id: number;
  profession_id?: number;
  language_id?: number;
  limit_patient: number;
  last_login?: string;
  chat_rooms?: string[];
};
