export interface IProvinceResource {
  id: number;
  identity: string;
  region_name: string;
  region_id: number;
  name: string;
  therapist_limit: number;
  phc_worker_limit: number;
}

export interface IProvinceEntitiesCount {
  rehab_service_count: number;
  rehab_service_admin_count: number;
  phc_service_count: number;
  phc_service_admin_count: number;
  therapist_count: number;
  phc_worker_count: number;
  patient_count: number;
}
