export interface IRegionResource {
  id: number;
  country_id: number;
  country: any;
  name: string;
  therapist_limit: number;
  phc_worker_limit: number;
}

export interface IRegion {
  id: number;
  name: string;
}

export interface IRegionEntitiesCount {
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
