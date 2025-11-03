import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

export interface IDeleteResponse {
  message: string;
}

export const useDelete = (resource: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => axiosInstance.delete<IDeleteResponse>(`/${resource}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
    }
  });
};
