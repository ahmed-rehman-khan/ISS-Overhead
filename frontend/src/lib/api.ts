import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export interface ISSPosition {
  latitude: number;
  longitude: number;
  location_name: string;
  altitude_km: number;
  velocity_kms: number;
  orbital_period_min: number;
}

export const getISSPosition = async (): Promise<ISSPosition> => {
  const { data } = await api.get<ISSPosition>("/iss-position");
  return data;
};

export const subscribe = async (
  name: string,
  email: string,
  city: string,
  country: string,
  alert_mode: string = "once"
): Promise<{ message: string }> => {
  const { data } = await api.post("/subscribe", { name, email, city, country, alert_mode });
  return data;
};

export const verifyOTP = async (
  email: string,
  code: string
): Promise<{ message: string }> => {
  const { data } = await api.post("/verify-otp", { email, code });
  return data;
};

export const resendOTP = async (
  email: string
): Promise<{ message: string }> => {
  const { data } = await api.post("/resend-otp", { email });
  return data;
};

export default api;
