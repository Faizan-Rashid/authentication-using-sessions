import API from "../config/apiClient";

type LoginParams = {
  email: string;
  password: string;
};
export const login = async (data: LoginParams) =>
  await API.post(`/api/v1/auth/login`, data);

type RegisterParams = LoginParams & { confirmPassword: string };
export const register = async (data: RegisterParams) =>
  await API.post("/api/v1/auth/register", data);

export const verifyEmail = async (verificationCode: string) =>
  await API.get(`/api/v1/auth/email/verify/${verificationCode}`);

export const forgotPassword = async (email: string) =>
  await API.post("/api/v1/auth/password/forgot", { email });

type ResetPasswordParams = {
  verificationCode: string;
  password: string;
};
export const resetPassword = async (data: ResetPasswordParams) =>
  await API.post("/api/v1/auth/password/reset", data);

export const getUser = async () => await API.get(`/api/v1/user`);
