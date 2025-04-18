import { getSessions } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export const SessionKey = "session";

const useSessions = () => {
  const { data: sessions, ...rest } = useQuery({
    queryKey: [SessionKey],
    queryFn: getSessions,
    select: (res) => res.data,
  });

  return {
    sessions,
    ...rest,
  };
};

export default useSessions;
