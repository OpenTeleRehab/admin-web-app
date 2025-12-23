export interface IGuidanceRequest {
  title: string;
  content: any;
  lang: number;
  target_role: 'phc_worker' | 'therapist';
}
