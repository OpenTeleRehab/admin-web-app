export interface ICountryResource {
  id: string | number;
  identity: string;
  name: string;
  iso_code: string;
  phone_code: string | number;
  language_id: string | number;
  therapist_limit: number;
}
