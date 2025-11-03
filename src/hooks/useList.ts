import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IApiResponse } from 'interfaces/IApiResponse';
import axiosInstance from 'utils/axios';

export const useList = <T = any>(resource: string, params: any = {}): UseQueryResult<IApiResponse<T>, unknown> => {
  return useQuery<IApiResponse<T>>({
    queryKey: [resource, params],
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<IApiResponse<T>>(`/${resource}`, { params, signal });

      return {
        ...response.data,
        data: response?.data?.data ?? response.data
      };
    }
  });
};
