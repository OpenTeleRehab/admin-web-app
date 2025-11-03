export interface IApiResponse<T> {
  data: T[];
  [key: string]: any;
}
