import { forgotPassword } from "../lib/api";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: forgetPassword,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: forgotPassword,
  });

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col">
      <div className="lg:w-1/3 flex flex-col">
        <h1 className="text-3xl font-bold mb-3 text-center">Reset Password</h1>
        <div className="flex flex-col gap-3 justify-center bg-gray-700 p-4 rounded-sm">
          {isError && (
            <p className="text-sm text-red-500 text-center">
              {error.message || "Error occured"}
            </p>
          )}

          {isSuccess && (
            <p className="text-sm text-green-500 text-center">
              {
                "Password reset email send. Please check your inbox for furthur details"
              }
            </p>
          )}

          {!isSuccess && (
            <>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                className="bg-gray-900 rounded-md"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <Button variant="outlined" onClick={() => forgetPassword(email)}>
                Reset Password
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
