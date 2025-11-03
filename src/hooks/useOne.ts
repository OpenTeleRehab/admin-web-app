import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

type OptionsType = {
  params?: any;
  enabled?: boolean;
};

export const useOne = <T = any>(
  resource: string,
  id: string | number | null,
  options: OptionsType = {
    params: {},
    enabled: true
  }
): UseQueryResult<T> => {
  const { params, enabled } = options;

  let endPoint = `/${resource}`;

  if (id) {
    endPoint = `/${resource}/${id}`;
  }

  return useQuery<T>({
    queryKey: [resource, id, params],
    queryFn: () => axiosInstance.get(endPoint, { params }).then(res => res.data),
    enabled: enabled || !!id
  });
};
