export interface IReferralResource {
  id: number;
  date_of_birth: string;
  lead_and_supplementary_phc: string[];
  referred_by: string;
  status: string;
  therapist_reason: string | null;
}
