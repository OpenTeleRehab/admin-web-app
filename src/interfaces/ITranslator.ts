export interface ITranslatorRequest {
  email: string;
  first_name: string;
  last_name: string;
  edit_language_ids: number[];
}

export interface ITranslatorResource extends Omit<ITranslatorRequest, 'edit_language_ids'> {
  id: number;
  edit_languages: { id: number, name: string }[];
}
