export interface IEmailTemplateRequest {
  id: string | number;
  title: string;
  content_type: string;
  content: string;
  lang: number;
}

export interface IEmailTemplateResource {
  id: string | number;
  title: string;
  content_type: string;
  content: string;
}
