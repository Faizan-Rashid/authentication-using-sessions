import { Alert, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { verifyEmail } from "../lib/api";

const VerifyEmail = () => {
  const { code } = useParams();
  
  const { isPending, isError, isSuccess } = useQuery({
    queryKey: ["emailVerification", "code"],
    queryFn: () => verifyEmail(code as string),
  });

  return (
    <div className="">
      {isPending ? (
        <CircularProgress size={"2rem"} />
      ) : isSuccess ? (
        <Alert severity="success" className="w-1/4 m-auto flex justify-center">
          Email Verified!
        </Alert>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <Alert severity="error" className="w-1/4 m-auto flex justify-center">
            Error while verifying Email
          </Alert>
          <p className="font-light text-sm">
            The Link is either Invalid or expired. &nbsp;
            <Link to={"/password/forgot"} className=" text-blue-500 underline">Get a new link</Link>
          </p>
        </div>
      )}

      <Link to={"/"} className="block text-center mt-3 text-blue-500">
        Go back to Home
      </Link>
    </div>
  );
};
export default VerifyEmail;
