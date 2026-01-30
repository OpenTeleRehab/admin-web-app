export interface IReferralResource {
  id: number;
  patient_id: number;
  patient_identity: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  lead_and_supplementary_phc: string[];
  referred_by: string;
  status: string;
  request_reason: string;
  therapist_reason: string | null;
}
