export interface ILanguageResource {
  id: number;
  name: string;
  code: string;
  rtl: boolean;
  fallback: string;
  is_used: boolean;
  auto_translated: boolean;
}
