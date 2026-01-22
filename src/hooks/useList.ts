import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { IApiResponse } from 'interfaces/IApiResponse';
import axiosInstance from 'utils/axios';

export const useList = <T = any>(resource: string, params: any = {}, options: Partial<UseQueryOptions<IApiResponse<T>>> = {}, headers?: Record<string, string>): UseQueryResult<IApiResponse<T>, unknown> => {
  return useQuery<IApiResponse<T>>({
    queryKey: [resource, params, headers],
    queryFn: async ({ signal }) => {
      const response = await axiosInstance.get<IApiResponse<T>>(`/${resource}`, { params, signal, headers });
      return {
        ...response.data,
        data: response?.data?.data ?? response.data
      };
    },
    ...options
  });
};
