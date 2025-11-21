import { getBaseURL } from "../utils/url.utils";

export const APIUrl = {
  base: getBaseURL(),
  auth: {
    signin: () => "/api/auth/signin",
    signup: () => "/api/auth/register",
    signout: () => "/api/auth/signout",
    session: () => "/api/auth/session",
  },
};

