export interface IClinic {
  id: number;
  identity: string;
  name: string;
  country_id: number;
  country_name?: string;
  region_id?: number;
  region_name?: string;
  region?: {
    id: number;
    name: string;
  };
  province_id?: number;
  province_name?: string;
  province?: {
    id: number;
    name: string;
    region_id: number;
  };
  therapist_limit: number;
  phone?: string;
  dial_code?: string;
}

export interface IClinicEntitiesCount {
  rehab_service_admin_count: number;
  therapist_count: number;
  patient_count: number;
}
