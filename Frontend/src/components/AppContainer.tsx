import useAuth from "@/hooks/useAuth";
import { CircularProgress } from "@mui/material";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return <>{isLoading ? <CircularProgress size={"2rem"} /> : user}</>;
};
export default AppContainer;
