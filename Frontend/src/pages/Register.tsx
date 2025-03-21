import { register } from "../lib/api";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () =>
      navigate("/", {
        replace: true,
      }),
  });

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col">
      <div className="lg:w-1/3 flex flex-col">
        <h1 className="text-3xl font-bold mb-3 text-center">
          Create An account
        </h1>
        <div className="flex flex-col gap-3 justify-center bg-gray-700 p-4 rounded-sm">
          {isError && (
            <p className="text-sm text-red-500 text-center">
              {error.message || "Error occured"}
            </p>
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            className="bg-gray-900 rounded-md"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            className="bg-gray-900 rounded-md"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            className="bg-gray-900 rounded-md"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              e.key === "Enter" &&
                register({ email, password, confirmPassword });
            }}
          />

          <Link
            to={`/password/forgot`}
            className="lg:text-right text-center text-blue-400"
          >
            Forgot Password
          </Link>

          <Button
            variant="outlined"
            disabled={
              !email ||
              password.length < 6 ||
              isPending ||
              password !== confirmPassword
            }
            onClick={() => createAccount({ email, password, confirmPassword })}
          >
            {isPending ? <CircularProgress size={"2rem"} /> : "register"}
          </Button>

          <p className="text-sm text-center">
            Already have an account?
            <Link to={"/login"} className=" text-blue-400 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
