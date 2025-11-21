import { APIUrl } from "@/lib/constants/url.config";
import axios from "axios";
import { getSession } from "next-auth/react";

async function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const session = await getSession();
  return session?.accessToken;
}

const httpClient = axios.create({
  baseURL: APIUrl.base,
  withCredentials: true,
});

export const httpClientWithoutToken = axios.create({
  baseURL: APIUrl.base,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;

