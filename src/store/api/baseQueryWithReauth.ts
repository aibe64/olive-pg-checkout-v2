import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Encryption } from "../../utils/encryption";
import { RootState } from "..";

export const baseQueryWithReauth =
  (baseQuery: ReturnType<typeof fetchBaseQuery>) =>
  async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  };

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (() => {
      const state = getState() as RootState
      try {
        const encryptedToken = state.app?.token
        if (!encryptedToken) return null;

        const decryptedToken = Encryption.decrypt(encryptedToken);
        return JSON.parse(decryptedToken || "");
      } catch (error) {
        return null;
      }
    })();
    try {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    } catch (error) {
      return headers;
    }
  },
});
