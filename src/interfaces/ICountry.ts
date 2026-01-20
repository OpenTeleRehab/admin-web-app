export interface ICountryResource {
  id: string | number;
  identity: string;
  name: string;
  iso_code: string;
  phone_code: string | number;
  language_id: string | number;
  therapist_limit: number;
}

export interface ICountryEntitiesCount {
  country_admin_count: number;
  region_count: number;
  regional_admin_count: number;
  province_count: number;
  rehab_service_count: number;
  rehab_service_admin_count: number;
  phc_service_count: number;
  phc_service_admin_count: number;
  therapist_count: number;
  phc_worker_count: number;
  patient_count: number;
}
