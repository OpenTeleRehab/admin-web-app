import { IPHCService } from './IPHCService';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: string;
  clinic_id?: number;
  country_id?: number;
  enabled: boolean;
  last_login?: string;
  gender?: string;
  language_id?: number;
  region_name?: string;
  phc_service?: IPHCService ;
}
