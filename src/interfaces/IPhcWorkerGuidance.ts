export interface IPhcWorkerGuidanceResource {
  id: number;
  title: string;
  content: string;
  order: number;
  auto_translated: boolean;
}

export interface IPhcWorkerGuidancesResponse {
  data: IPhcWorkerGuidanceResource[];
}
