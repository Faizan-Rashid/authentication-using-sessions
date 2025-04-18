import { Alert } from "@mui/material";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user?.data;


  return (
    <div className="w-[50%] h-[50%] flex flex-col gap-5">
      <h1 className="text-2xl font-bold w-full text-center">My Account</h1>
      <div className="flex flex-col items-center gap-2">
        {!verified && (
          <div>
            <Alert severity="warning">
              You are not verified. Please verify your email
            </Alert>
          </div>
        )}
        <div>
          <span className="font-bold text-md">email : </span>
          <span className="">{email}</span>
        </div>
        <div>
          <span className="font-bold text-md">created at : </span>
          <span className="">
            {new Date(createdAt).toLocaleDateString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Profile;
