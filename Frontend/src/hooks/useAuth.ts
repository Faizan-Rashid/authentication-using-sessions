import { getUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = (options: {} = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: ["auth"],
    queryFn: getUser,
    staleTime: Infinity,
    ...options,
  });

  return {
    user,
    ...rest,
  };
};
export default useAuth;
