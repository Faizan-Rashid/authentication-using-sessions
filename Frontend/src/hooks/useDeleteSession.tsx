import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../lib/api";
import { SessionKey } from "./useSessions";

const useDeleteSession = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate, data, ...rest } = useMutation({
    mutationFn: () => {
      return deleteSession(id);
    },
    onError: (error) => {
      console.log(`error occcufeeq`, error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SessionKey] });
    },
  });
  return {
    deleteSession: mutate,
    ...rest,
  };
};
export default useDeleteSession;
