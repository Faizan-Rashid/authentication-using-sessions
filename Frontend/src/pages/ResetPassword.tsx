import { Button, CircularProgress, TextField } from "@mui/material";
import { resetPassword } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isError,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: resetPassword,
  });

  const code = searchParams.get("code");
  const exp = Number(searchParams.get("expiresAt"));
  const now = Date.now();

  const isValid = code && exp && exp > now;

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col">
      <div className="lg:w-1/3 flex flex-col">
        <h1 className="text-3xl font-bold mb-3 text-center">
          Change Your Password
        </h1>
        <div className="flex flex-col gap-3 justify-center bg-gray-700 p-4 rounded-sm">
          {isError && (
            <p className="text-sm text-red-500 text-center">
              {"Error occured"}
            </p>
          )}

          {isSuccess && (
            <p className="text-sm text-green-500 text-center">
              {"Password reset successfully"}
            </p>
          )}

          {!isValid && (
            <p className="text-sm text-red-500 text-center">
              Invalid or expired link ,{" "}
              <Link
                to={`/password/forgot`}
                className=" text-blue-500 underline"
              >
                get a new link
              </Link>
            </p>
          )}

          {!isSuccess && isValid && (
            <>
              <TextField
                label="Enter your new password"
                type="password"
                variant="outlined"
                className="bg-gray-900 rounded-md"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <Button
                variant="outlined"
                disabled={password.length < 6}
                onClick={() =>
                  resetUserPassword({ verificationCode: code, password })
                }
              >
                {isPending ? (
                  <CircularProgress size={"2rem"} />
                ) : (
                  "Change Password"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
