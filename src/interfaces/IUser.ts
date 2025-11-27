import { IPHCService } from './IPHCService';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: string;
  clinic_id?: number;
  country_id?: number;
  country_name?: string;
  enabled: boolean;
  last_login?: string;
  gender?: string;
  language_id?: number;
  region_name?: string;
  region_id?: number;
  phc_service?: IPHCService ;
}

export interface IRegionalAdminRequest {
  email: string;
  first_name: string;
  last_name: string;
  type: string;
  region_id: number;
  country_name?: string;
}
