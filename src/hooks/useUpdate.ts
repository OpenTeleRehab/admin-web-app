import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'utils/axios';

type UpdateMutateProps<T> = {
  id: string | number;
  payload: T;
};

export const useUpdate = <T = any>(resource: string) => {
  const queryClient = useQueryClient();

  return useMutation<T, unknown, UpdateMutateProps<T>>({
    mutationFn: async ({ id, payload }: UpdateMutateProps<T>) => {
      const { data } = await axiosInstance.put<T>(`/${resource}/${id}`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({ queryKey: [resource, id] });
    }
  });
};
