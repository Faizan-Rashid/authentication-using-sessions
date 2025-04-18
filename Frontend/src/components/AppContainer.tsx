import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import UserMenu from "./UserMenu";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return (
    <>
      {isLoading ? (
        <CircularProgress size={"2rem"} />
      ) : user ? (
        <div className="flex justify-center flex-col w-[100vw] h-[100vh] items-center">
          <Outlet />
          <UserMenu />
        </div>
      ) : (
        <Navigate
          to={"/login"}
          replace
          state={{
            redirectUrl: window.location.pathname,
          }}
        />
      )}
    </>
  );
};
export default AppContainer;
