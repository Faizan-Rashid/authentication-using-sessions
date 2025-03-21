import { Button, CircularProgress, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log(`success`);
      navigate("/", {
        replace: true,
      });
    },
  });

  return (
    <div className="h-[100vh] flex items-center justify-center flex-col">
      <div className="lg:w-1/3 flex flex-col">
        <h1 className="text-3xl font-bold mb-3 text-center">
          Sign In to Your account
        </h1>
        <div className="flex flex-col gap-3 justify-center bg-gray-700 p-4 rounded-sm">
          {isError && (
            <p className="text-sm text-red-500 text-center">
              Inavlid Credentials
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
            onKeyDown={(e) => {
              e.key === "Enter" && signIn({ email, password });
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
            disabled={!email || password.length < 6 || isPending}
            onClick={() => signIn({ email, password })}
          >
            {isPending ? <CircularProgress size={"2rem"} /> : "Sign in"}
          </Button>

          <p className="text-sm text-center">
            Don't have an Account?{" "}
            <Link to={"/register"} className=" text-blue-400 underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
